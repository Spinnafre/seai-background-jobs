"use strict";

import puppeteer from "puppeteer";

import { setTimeout } from "node:timers/promises";

import { Readable, Transform, Writable } from "node:stream";
import { pipeline } from "node:stream/promises";

import { dataAsStream } from "../../utils/generator.js";

import { Validator } from "../../utils/Validator.js";
import { Result } from "../../utils/Result.js";
import { getYesterdayDateFormatted } from "../../utils/date.js";

export class InmetScrapper {
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

  get props() {
    return this.#props;
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
      return Result.error(hasNullOrUndefined.error);
    }

    const validMeasures = [
      "Precipitação Total (mm)",
      "Vel. do Vento Média (m/s)",
      "Raj. do Vento Máxima (m/s)",
      "Temp. Média (°C)",
      "Temp. Máxima (°C)",
      "Temp. Mínima (°C)",
      "Umi. Média (%)",
      "Umi. Mínima (%)",
    ];

    const validCountries = ["BRAZIL", "N", "NE", "CO", "SE", "S"];

    const validStationsTypes = ["todas", "automaticas", "convencionais"];

    const validDates = ["diario", "horario", "mensal", "prec", "extremos"];

    const hasValidMeasures = Validator.checkIfRawArrayHasValidValues(
      params.params,
      validMeasures
    );

    if (hasValidMeasures.isFailure) {
      return Result.error(hasValidMeasures.error);
    }

    const attrs = [
      {
        argument: params.country,
        argumentName: "Country",
        validValues: validCountries,
      },
      {
        argument: params.date_type,
        argumentName: "Date type",
        validValues: validDates,
      },
      {
        argument: params.stations_type,
        argumentName: "Stations types",
        validValues: validStationsTypes,
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
        return Result.error(hasValidAttr.error);
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
  #translateMeasureName(measureName) {
    const measures = {
      temperatura: "temperature",
      ventovel: "windSpeed",
      umidade: "humidity",
      precipitacao: "precipitation",
    };

    return measures[measureName];
  }
  #concatenateMeasures(stations, measureName) {
    return new Writable({
      objectMode: true,
      write(chunk, enc, next) {
        const { date, name, code, state, country, latitude, longitude, value } =
          chunk;

        if (!stations.has(code)) {
          stations.set(code, {
            date,
            code,
            name,
            state,
            country,
          });
        }

        stations.set(
          code,
          Object.assign(stations.get(code), {
            [measureName]: value,
          })
        );

        next();
      },
    });
  }

  #filterMeasuresByState() {
    const filter = this.#props.state;

    return new Transform({
      objectMode: true,
      transform(chunk, enc, cb) {
        const { state } = chunk;
        if (filter) {
          if (filter == state) return cb(null, chunk);
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
      : getYesterdayDateFormatted({
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

        cb(
          null,
          Object.assign(
            {},
            {
              date: dateTime,
              name: nome,
              code: codigo,
              state: estado,
              country: regiao,
              latitude,
              longitude,
              value: valor,
            }
          )
        );
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

        const measureName = this.#translateMeasureName(parameter.split("-")[0]);

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
    const paramsOrError = this.#validateParams(params);

    if (paramsOrError.isSuccess) {
      this.#props = params;
    }

    return paramsOrError;
  }

  async getStationsByCodesAndDate(codes = [], date) {
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
      // await this.closeBrowser();

      throw new Error(
        "Não foi possível obter identificadores dos parâmetros das medições das estações"
      );
    }

    await this.#pageHandler.waitForSelector(".btn-green");

    const stationsWithMeasures = await this.#getMeasuresFromParameters(
      parametersCodes
    );

    await this.closeBrowser();

    return stationsWithMeasures.filter(
      (station) => codes.includes(station.code) && station.date === date
    );
  }
}
