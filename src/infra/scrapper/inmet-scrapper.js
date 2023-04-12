"use strict";

import puppeteer from "puppeteer";

import { setTimeout } from "node:timers/promises";

import { Readable, Transform, Writable } from "node:stream";
import { pipeline } from "node:stream/promises";

import { dataAsStream } from "../../utils/generator.js";

import { Validator } from "../../utils/Validator.js";
import { Result } from "../../utils/Result.js";
import { getYesterdayDate } from "../../utils/date.js";

class InmetScrapper {
  #browserHandler = {};

  #pageHandler = {};

  #pageUrl = null;
  #pageTimeout = 30000;

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

  constructor(url, browserHandler, pageHandler) {
    this.#pageUrl = url;
    this.#browserHandler = browserHandler;
    this.#pageHandler = pageHandler;
  }

  static async build(
    scrapperConfig = {
      url: "",
      timeout: "",
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

    const scrapper = new InmetScrapper(
      scrapperConfig.url,
      browserHandler,
      pageHandler
    );

    return scrapper;
  }

  async closeBrowser() {
    console.log("Closing page...");
    await this.#pageHandler.close();

    console.log("Closing browser...");
    await this.#browserHandler.close();
  }

  static validateParams(
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
      return Result.error(hasNullOrUndefined.message);
    }

    const hasValidMeasures = Validator.checkIfRawArrayHasValidValues(
      params.params,
      InmetScrapper.validMeasures
    );

    if (hasValidMeasures.isFailure) {
      return Result.error(hasValidMeasures.error);
    }

    const attrs = [
      {
        argument: params.country,
        argumentName: "Country",
        validValues: InmetScrapper.validCountries,
      },
      {
        argument: params.date_type,
        argumentName: "Date type",
        validValues: InmetScrapper.validDates,
      },
      {
        argument: params.stations_type,
        argumentName: "Stations types",
        validValues: InmetScrapper.validStationsTypes,
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
        return Result.error(hasValidAttr.message);
      }
    }

    return Result.success(params);
  }

  #setPageUrl(url) {
    this.#pageUrl = url;
  }

  setPageTimeout(timeout) {
    this.#pageTimeout = timeout;
    return this;
  }

  async #openPage() {
    console.log(`Acessando URL: ${this.#pageUrl}.`);

    await this.#pageHandler.goto(this.#pageUrl, {
      waitUntil: "domcontentloaded",
      timeout: this.#pageTimeout,
    });

    const pageTitle = await this.#pageHandler.title();

    console.log("Sucesso ao acessar página ", pageTitle);
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
            date: chunk.date,
            codigo: chunk.codigo,
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
    const hasDateTime =
      Reflect.has(this.#props, "date_time") && this.#props.date_time;

    const dateTime = hasDateTime
      ? this.#props.date_type
      : getYesterdayDate({
          locale: "pt-BR",
          formatOptions: {
            day: "numeric",
            month: "numeric",
            year: "numeric",
          },
        });

    return new Transform({
      objectMode: true,
      transform(chunk, enc, cb) {
        const { codigo, nome, estado, regiao, latitude, longitude, valor } =
          chunk;

        const data = Object.assign(
          {},
          {
            date: dateTime,
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
        console.log("[✅] Sucesso ao obter dados de medição ");

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
    this.#props = params;
  }
  async getStationsWithMeasures() {
    await this.#openPage();

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

    if (!parametersCodes.length) {
      this.closeBrowser();

      throw new Error(
        "Não foi possível obter identificadores dos parâmetros das medições das estações"
      );
    }

    await this.#pageHandler.waitForSelector(".btn-green");

    const stationsWithMeasures = await this.#getMeasuresFromParameters(
      parametersCodes
    );

    this.closeBrowser();

    return stationsWithMeasures;
  }
}

export { InmetScrapper };
