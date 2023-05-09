"use strict";

import { setTimeout } from "node:timers/promises";

import { Validator } from "../../utils/Validator.js";
import { Result } from "../../utils/Result.js";
import { mapMeasureNameToDomain } from "../../core/mappers/inmet/stationMap.js";

import scrapperConfig from '../../config/scrapper.js'

export class ScrapperGateway {
  #scrapper
  constructor(scrapper) {
    this.#scrapper = scrapper;
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
  #formatStations(stations = []) {
    return stations.map((station) => {
      const { codigo, nome, estado, regiao, latitude, longitude, valor } =
        station;

      return {
        name: nome,
        code: codigo,
        state: estado,
        country: regiao,
        latitude,
        longitude,
        value: valor,
      }
    })
  }

  async #getMeasures(measuresCodes) {
    const stations = new Map();

    for (const measureCode of measuresCodes) {
      //Selecionar medição
      const selectMeasureTypeButton = await this.#scrapper.getElementHandler(
        "#estacao-parametro"
      );
      await selectMeasureTypeButton.select(measureCode);

      await this.#scrapper.elementEvaluate("#btn-estacao-BUSCAR", (btn) => {
        btn.click();
      });

      console.log(`[🔍] Buscando dados da medição ${measureCode}`);

      const data = await this.#scrapper.getJSONResponseFromRequest(scrapperConfig.page.url, "OPTIONS");

      if (data) {
        console.log("[✅] Sucesso ao obter dados de medição ");

        const { estacoes } = data;

        const filteredStationsByState = estacoes.filter((station) => station.estado == state)

        const measureName = mapMeasureNameToDomain(measureCode.split("-")[0])

        const stations = this.#formatStations(estacoes)

        await pipeline(
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

  async getStations(params = {
    country: "",
    stations_type: "",
    state: "",
    date_type: "",
    date: "",
    measures: [],
  }) {
    const { country, stations_type, state,
      date_type, measures } = params

    await this.#scrapper.openNewTab()

    await setTimeout(500);

    await this.#scrapper.waitForElement(".sidebar", 20000)

    await setTimeout(500);

    const formInputsSelectors = [
      { value: country, selector: "#estacao-regiao" },
      { value: stations_type, selector: "#estacao-tipo" },
      { value: date_type, selector: "#estacao-tipo-dados" },
    ];

    //Select items from form dropdowns
    for (const { value, selector } of formInputsSelectors) {
      const input = await this.#scrapper.getElementHandler(selector);
      await input.select(value);
    }

    await setTimeout(100);

    // Get measures codes from page
    const measuresCodes = await this.#scrapper.pageEvaluate(measures, (params) => {
      const options = document.querySelector("#estacao-parametro").children;

      return Array.from(options)
        .filter((option) => params.includes(option.innerHTML))
        .map((option) => option.value);
    })


    if (!measuresCodes.length) {
      await this.closeBrowser();

      throw new Error(
        "Não foi possível obter identificadores dos parâmetros das medições das estações"
      );
    }

    await this.#scrapper.waitForElement(".btn-green");

    const stationsWithMeasures = await this.#getMeasuresFromParameters(
      measuresCodes
    );

    await this.closeBrowser();

    return stationsWithMeasures;
  }
}
