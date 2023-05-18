"use strict";

import { Mapper } from "../../../core/mappers/mapper.js";

import scrapperConfig from "../../../config/scrapper.js";

import { setTimeout } from "timers/promises";
export class InmetDataMiner {
  #scrapper;
  constructor(scrapper) {
    this.#scrapper = scrapper;
  }
  async getMeasuresCodes(measures_names) {
    const codes = await this.#scrapper.pageEvaluate(measures_names, (param) => {
      const options = document.querySelector("#estacao-parametro").children;

      return Array.from(options)
        .filter((option) => param.includes(option.innerHTML))
        .map((option) => option.value);
    });
    console.log("codes ", codes);
    // Selecionar o botão de buscar estações
    await this.#scrapper.waitForElement(".btn-green");

    return codes;
  }

  async fetchMeasuresData(measureCode, eqpCodes, location) {
    //Selecionar medição
    const selectMeasureTypeButton = await this.#scrapper.getElementHandler(
      "#estacao-parametro"
    );

    await selectMeasureTypeButton.select(measureCode);

    await this.#scrapper.elementEvaluate("#btn-estacao-BUSCAR", (btn) => {
      btn.click();
    });

    console.log(`[🔍] Buscando dados da medição ${measureCode}`);

    const response = await this.#scrapper.getJSONResponseFromRequest(
      "apimapas.inmet.gov.br/dados",
      "OPTIONS"
    );
    console.log(response);

    if (response) {
      console.log("[✅] Sucesso ao obter dados de medição ");

      const { estacoes } = response;

      const measures = estacoes.filter(
        (station) =>
          station.estado === location && eqpCodes.includes(station.codigo)
      );

      return measures;
    }

    return null;
  }

  async getEquipmentWithMeasures(
    measures_names,
    equipments_codes,
    location_state
  ) {
    const measuresCodes = await this.getMeasuresCodes(measures_names);

    if (!measuresCodes.length) {
      console.log(
        "Não foi possível obter identificadores dos parâmetros das medições"
      );
      return;
    }

    const equipments = new Map();

    for (const measureToQueryCode of measuresCodes) {
      const measures = await this.fetchMeasuresData(
        measureToQueryCode,
        equipments_codes,
        location_state
      );

      if (measures.length) {
        const measureName = Mapper.mapMeasureNameToDomain(
          measureToQueryCode.split("-")[0]
        );

        measures.forEach((measure) => {
          const { codigo, nome, estado, regiao, valor } = measure;

          const EquipmentCodeNotExists = equipments.has(codigo) === false;

          if (EquipmentCodeNotExists) {
            equipments.set(codigo, {
              code: codigo,
              name: nome,
              state: estado,
              country: regiao,
            });
          }

          equipments.set(
            codigo,
            Object.assign(equipments.get(codigo), {
              [measureName]: valor,
            })
          );
        });
      }
    }

    return [...equipments.values()];
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
      (await this.getEquipmentWithMeasures(
        scrapperConfig.stations_measures,
        equipments_codes.stations,
        state
      ));

    const pluviometersMeasures =
      equipments_codes.pluviometers.length &&
      (await this.getEquipmentWithMeasures(
        scrapperConfig.pluviometers_measures,
        equipments_codes.pluviometers,
        state
      ));

    await this.#scrapper.closeBrowser();

    return {
      stationsMeasures,
      pluviometersMeasures,
    };
  }
}
