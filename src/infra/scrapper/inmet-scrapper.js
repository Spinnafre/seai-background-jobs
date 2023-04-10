"use strict";

import puppeteer from "puppeteer";

import { setTimeout } from "node:timers/promises";

import { Readable, Transform, Writable } from "node:stream";
import { pipeline } from "node:stream/promises";

import { dataAsStream } from "../../utils/generator.js";

import { Validator } from "../../utils/Validator.js";
import { Result } from "../../utils/Result.js";

class INMETScrappper {
  #browserHandler = {};

  #pageHandler = {};

  #props = {
    country: "",
    stations_type: "",
    state: "",
    date_type: "",
    params: [],
  };

  static validMeasures = [
    "Precipitação Total (mm)",
    "Vel. do Vento Média (m/s)",
    "Raj. do Vento Máxima (m/s)",
    "Temp. Média (°C)",
    "Temp. Máxima (°C)",
    "Temp. Mínima (°C)",
    "Umi. Média (%)",
    "Umi. Mínima (%)",
  ];

  static validCountries = ["BRAZIL", "N", "NE", "CO", "SE", "S"];

  static validStationsTypes = ["todas", "automaticas", "convencionais"];

  static validDates = ["diario", "horario", "mensal", "prec", "extremos"];

  constructor(browserHandler, pageHandler) {
    this.#browserHandler = browserHandler;
    this.#pageHandler = pageHandler;
  }

  static async setup(
    scrapperConfig = {
      userAgent: "",
      launch: {
        headless: true,
        args: [],
      },
    }
  ) {
    const browserHandler = await puppeteer.launch(scrapperConfig.launch);

    const pageHandler = await browserHandler.newPage();

    pageHandler.on("load", () => console.log("Página carregada com sucesso"));
    pageHandler.on("error", (err) => console.log("ERROR ", err));

    await pageHandler.setBypassCSP(true);

    if (!scrapperConfig.launch.headless) {
      await pageHandler.setViewport({ width: 500, height: 500 });
    }

    await pageHandler.setUserAgent(scrapperConfig.userAgent);

    return new INMETScrappper(browserHandler, pageHandler);
  }

  async #closeBrowser() {
    console.log("Closing page...");
    await this.#pageHandler.close();

    console.log("Closing browser...");
    await this.#browserHandler.close();
  }

  #validateParams(
    params = {
      country: "",
      stations_type: "",
      state: "",
      date_type: "",
      params: [],
    }
  ) {
    const hasNullOrUndefined = Validator.againstNullOrUndefinedBulk([
      { argument: params.country, argumentName: "Country" },
      { argument: params.date_type, argumentName: "Date type" },
      { argument: params.params, argumentName: "Stations measures" },
      { argument: params.state, argumentName: "State" },
      { argument: params.stations_type, argumentName: "Stations types" },
    ]);

    if (hasNullOrUndefined.isFailure) {
      return Result.error({
        error: hasNullOrUndefined.message,
      });
    }

    const hasValidMeasures = Validator.checkIfRawArrayHasValidValues(
      params.params,
      INMETScrappper.validMeasures
    );

    if (hasValidMeasures.isFailure) {
      return Result.error({
        error: hasValidMeasures.message,
      });
    }

    const attrs = [
      {
        argument: params.country,
        argumentName: "Country",
        validValues: INMETScrappper.validCountries,
      },
      {
        argument: params.date_type,
        argumentName: "Date type",
        validValues: INMETScrappper.validDates,
      },
      {
        argument: params.stations_type,
        argumentName: "Stations types",
        validValues: INMETScrappper.validStationsTypes,
      },
    ];

    for (const { argument, argumentName, validValues } of attrs) {
      const hasValidAttr = Validator.isOneOf(
        {
          argument,
          argumentName,
        },
        validValues
      );

      if (hasValidAttr.isFailure) {
        return Result.error({
          error: hasValidAttr.message,
        });
      }
    }

    return Result.success(params);
  }

  async openUrl(url, timeout = 30000) {
    console.log(`Acessando URL: ${url}.`);

    await this.#pageHandler.goto(url, {
      waitUntil: "domcontentloaded",
      timeout,
    });

    const pageTitle = await this.#pageHandler.title();

    console.log("Sucesso ao acessar página ", pageTitle);

    return this;
  }

  // Get codes from params specified by users
  async #getCodesFromStationsParams(userParams) {
    const codes = await this.#pageHandler.evaluate((params) => {
      const options = document.querySelector("#estacao-parametro").children;

      return Array.from(options)
        .filter((option) => params.includes(option.innerHTML))
        .map((option) => option.value);
    }, userParams);

    return codes;
  }

  async #fetchMeasures() {
    //Promise para esperar pela a resposta da requisição AJAX
    //Que não seja a requisição do tipo OPTIONS (preflight)
    const xmr = this.#pageHandler.waitForResponse(
      (r) =>
        r.request().url().includes("apimapas.inmet.gov.br/dados") &&
        r.request().method() != "OPTIONS"
    );

    //Esperar pela a resposta das requisiçõe ajax específicas
    const ajaxResponse = await xmr;

    const measures = await ajaxResponse.json();

    return measures;
  }

  #concatenateMeasures(stations, measureName) {
    return new Writable({
      objectMode: true,
      write(chunk, enc, next) {
        if (!stations.has(chunk.codigo)) {
          stations.set(chunk.codigo, {
            nome: chunk.nome,
            estado: chunk.estado,
            regiao: chunk.regiao,
          });
        }

        stations.set(
          chunk.codigo,
          Object.assign(stations.get(chunk.codigo), {
            [measureName]: chunk.valor,
          })
        );

        next();
      },
    });
  }

  #filterMeasuresByState() {
    const state = this.#props.state;

    return new Transform({
      objectMode: true,
      transform(chunk, enc, cb) {
        const { estado } = chunk;
        if (state) {
          if (state == estado) return cb(null, chunk);
          else return cb(null);
        } else {
          cb(null, chunk);
        }
      },
    });
  }

  #formatMeasures() {
    return new Transform({
      objectMode: true,
      transform(chunk, enc, cb) {
        const { codigo, nome, estado, regiao, latitude, longitude, valor } =
          chunk;

        const data = Object.assign(
          {},
          {
            nome,
            codigo,
            estado,
            regiao,
            latitude,
            longitude,
            valor,
          }
        );

        cb(null, data);
      },
    });
  }

  async #getMeasuresFromParameters(parameters) {
    const stations = new Map();

    for (const parameter of parameters) {
      //Selecionar medição
      const selectMeasureTypeBtn = await this.#pageHandler.$(
        "#estacao-parametro"
      );
      await selectMeasureTypeBtn.select(parameter);

      await this.#pageHandler.$eval("#btn-estacao-BUSCAR", (btn) => {
        btn.click();
      });

      console.log(`[🔍] Buscando dados da medição ${parameter}`);

      const measures = await this.#fetchMeasures();

      if (measures) {
        console.log("[✅] Sucesso ao obter dados de medição ", measures);

        const { estacoes } = measures;

        const readableStream = Readable.from(dataAsStream(estacoes));

        const measureName = parameter.split("-")[0];

        // const writable = createWriteStream(
        //   resolve(__dirname, "..", "data", "test.ndjson")
        // );

        await pipeline(
          readableStream,
          this.#formatMeasures(),
          this.#filterMeasuresByState(),
          this.#concatenateMeasures(stations, measureName)
        );
      }
    }

    return [...stations.values()];
  }

  setParams(params) {
    const result = this.#validateParams(params);

    if (result.isFailure) {
      throw new Error({
        error: result.message,
      });
    }

    this.#props = params;
  }

  async getStationsWithMeasures() {
    await setTimeout(1000);

    await this.#pageHandler.waitForSelector(".sidebar", {
      timeout: 20000,
    });

    await setTimeout(1000);

    const formInputsSelectors = [
      { value: this.#props.country, selector: "#estacao-regiao" },
      { value: this.#props.stations_type, selector: "#estacao-tipo" },
      { value: this.#props.date_type, selector: "#estacao-tipo-dados" },
    ];

    for (const { value, selector } of formInputsSelectors) {
      const input = await this.#pageHandler.$(selector);
      await input.select(value);
    }

    await setTimeout(300);

    const parametersCodes = await this.#getCodesFromStationsParams(
      this.#props.params
    );

    console.log("PARAMS CODES = ", parametersCodes);

    if (!parametersCodes.length) {
      this.#closeBrowser();

      throw new Error(
        "Não foi possível obter identificadores dos parâmetros das medições das estações"
      );
    }

    await this.#pageHandler.waitForSelector(".btn-green");

    const stationsWithMeasures = await this.#getMeasuresFromParameters(
      parametersCodes
    );

    console.log("Stations With Meditions = ", stationsWithMeasures);

    this.#closeBrowser();

    if (stationsWithMeasures.length) {
      console.log(
        "[✅] Sucesso ao obter dados concatenados de estações com medições \n",
        stationsWithMeasures
      );
      return stationsWithMeasures;
    } else
      console.log("[⚠️] Não há dados de estações com medições especificadas");
    return [];
  }
}

// export { INMETScrappper };

// url: "https://mapas.inmet.gov.br",
const scrapper = await INMETScrappper.setup({
  userAgent:
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/84.0.4147.125 Safari/537.36",
  launch: {
    headless: true,
    args: [
      // "--disable-gpu",
      // "--disable-dev-shm-usage",
      // "--disable-setuid-sandbox",
      "--no-sandbox",
      // "--disable-web-security",
      // "--disable-features=IsolateOrigins",
      // "--disable-site-isolation-trials",
      // "--disable-features=BlockInsecurePrivateNetworkRequests",
    ],
  },
});

await scrapper.openUrl("https://mapas.inmet.gov.br");

scrapper.setParams({
  country: "NE",
  stations_type: "automaticas",
  state: "CE",
  date_type: "diario",
  params: [
    "Precipitação Total (mm)",
    "Temp. Média (°C)",
    "Umi. Média (%)",
    "Vel. do Vento Média (m/s)",
  ],
});

const data = await scrapper.getStationsWithMeasures();
