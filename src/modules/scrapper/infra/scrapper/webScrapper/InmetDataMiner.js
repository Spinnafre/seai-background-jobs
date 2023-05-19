"use strict";

import scrapperConfig from "../../../config/scrapper.js";

import { setTimeout } from "timers/promises";
export class InmetDataMiner {
  #scrapper;
  constructor(scrapper) {
    this.#scrapper = scrapper;
  }

  async #fetchMeasureData(measureCode) {
    //Selecionar medição
    await this.#scrapper.selectInputValue("#estacao-parametro", measureCode);

    //Submit
    await this.#scrapper.elementEvaluate("#btn-estacao-BUSCAR", (btn) => {
      btn.click();
    });

    console.log(`[🔍] Buscando dados da medição ${measureCode}`);

    const response = await this.#scrapper.getJSONResponseFromRequest(
      "apimapas.inmet.gov.br/dados",
      "OPTIONS"
    );

    if (response) {
      console.log("[✅] Sucesso ao obter dados de medição ");

      const { estacoes } = response;

      return estacoes;
    }

    return null;
  }

  async getAverageTemperature() {
    return await this.#fetchMeasureData("temperatura-I104:0000");
  }
  async getAverageHumidity() {
    return await this.#fetchMeasureData("umidade-I120:0000");
  }

  async getAverageWindVelocity() {
    return await this.#fetchMeasureData("ventovel-I009:0000");
  }

  async getPrecipitation() {
    return await this.#fetchMeasureData("precipitacao-I006:1200");
  }

  async getStations(stations_codes = [], location_state) {
    const averageTemperature = await this.getAverageTemperature();
    const averageWindVelocity = await this.getAverageWindVelocity();
    const averageHumidity = await this.getAverageHumidity();

    const measures = {
      temperature: averageTemperature,
      windVelocity: averageWindVelocity,
      humidity: averageHumidity,
    };

    const station = new Map();

    for (const [measureName, data] of Object.entries(measures)) {
      if (data) {
        const measures = data.filter(
          (measure) =>
            measure.estado === location_state &&
            stations_codes.includes(measure.codigo)
        );

        measures.forEach((measure) => {
          const { codigo, nome, estado, regiao, valor } = measure;

          const EquipmentCodeNotExists = station.has(codigo) === false;

          if (EquipmentCodeNotExists) {
            station.set(codigo, {
              code: codigo,
              name: nome,
              state: estado,
              country: regiao,
            });
          }

          station.set(
            codigo,
            Object.assign(station.get(codigo), {
              [measureName]: valor,
            })
          );
        });
      }
    }

    return [...station.values()];
  }

  async getPluviometers(pluviometers_codes = [], location_state) {
    const precipitations = await this.getPrecipitation();

    let measures = [];

    if (precipitations) {
      measures = precipitations
        .filter(
          (measure) =>
            measure.estado === location_state &&
            pluviometers_codes.includes(measure.codigo)
        )
        .map((measure) => {
          const { codigo, nome, estado, regiao, valor } = measure;

          return {
            code: codigo,
            name: nome,
            state: estado,
            country: regiao,
            pluviometer: valor,
          };
        });
    }

    return measures;
  }

  async getMeasures(
    params = {
      equipments_codes: {
        stations: [],
        pluviometers: [],
      },
      country: "",
      stations_type: "",
      state: "",
      date_type: "",
      date: "",
    }
  ) {
    const { equipments_codes, country, stations_type, state, date_type, date } =
      params;

    console.log("params ", params);

    await this.#scrapper.launchBrowser();

    await this.#scrapper.openNewTab();

    await this.#scrapper.navigateToUrl(
      scrapperConfig.page.url,
      scrapperConfig.page.timeout
    );

    await setTimeout(1000);

    //Esperar o menu com os filtros do mapa de estações serem carregados
    await this.#scrapper.waitForElement(
      ".sidebar",
      scrapperConfig.page.timeout
    );

    for (const { value, selector } of [
      { value: country, selector: "#estacao-regiao" },
      { value: stations_type, selector: "#estacao-tipo" },
      { value: date_type, selector: "#estacao-tipo-dados" },
    ]) {
      await this.#scrapper.selectInputValue(selector, value);
    }

    await setTimeout(1000);

    /*
      [] - TODO-SELECIONAR O CAMPO DE DATA CASO FOR PASSADO ALGUMA DATA
    */

    const stationsMeasures =
      equipments_codes.stations.length &&
      (await this.getStations(equipments_codes.stations, state));

    const pluviometersMeasures =
      equipments_codes.pluviometers.length &&
      (await this.getPluviometers(equipments_codes.pluviometers, state));

    await this.#scrapper.closeBrowser();

    return {
      stationsMeasures,
      pluviometersMeasures,
    };
  }
}
