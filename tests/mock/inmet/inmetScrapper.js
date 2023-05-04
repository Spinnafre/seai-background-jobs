import { setTimeout } from "node:timers/promises";

import { Validator } from "../../utils/Validator.js";
import { Result } from "../../utils/Result.js";
import { getYesterdayDateFormatted } from "../../utils/date.js";
import { Readable } from "node:stream";
import { dataAsStream } from "../../../src/utils/generator.js";

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
    const browserHandler = {};

    const scrapper = new InmetScrapper(
      scrapperConfig.url,
      browserHandler,
      pageHandler
    );

    return scrapper;
  }

  async closeBrowser() {
    console.log("Closing page...");
    console.log("Closing browser...");
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

    console.log("Sucesso ao acessar página ");
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

  setParams(params) {
    const paramsOrError = this.#validateParams(params);

    if (paramsOrError.isSuccess) {
      this.#props = params;
    }

    return paramsOrError;
  }

  async getStationsWithMeasures() {}
}

export { InmetScrapper };
