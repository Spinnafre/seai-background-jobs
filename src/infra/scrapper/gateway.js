"use strict";

import { setTimeout } from "node:timers/promises";

import { mapMeasureNameToDomain } from "../../core/mappers/inmet/stationMap.js";

import scrapperConfig from '../../config/scrapper.js'

export class ScrapperGateway {
  #scrapper
  constructor(scrapper) {
    this.#scrapper = scrapper;
  }

  async getStationsWithMeasures(measuresCodesToQuery,stationsCodesToQuery=[],state) {
    
    const stationsWithMeasures = new Map();

    for (const measureToQueryCode of measuresCodesToQuery) {
      //Selecionar medição
      const selectMeasureTypeButton = await this.#scrapper.getElementHandler(
        "#estacao-parametro"
      );
      await selectMeasureTypeButton.select(measureToQueryCode);

      await this.#scrapper.elementEvaluate("#btn-estacao-BUSCAR", (btn) => {
        btn.click();
      });

      console.log(`[🔍] Buscando dados da medição ${measureToQueryCode}`);

      const data = await this.#scrapper.getJSONResponseFromRequest(scrapperConfig.page.url, "OPTIONS");

      if (data) {
        console.log("[✅] Sucesso ao obter dados de medição ");

        const { estacoes } = data;

        const stations = estacoes.filter(
          (station) => station.estado === state && stationsCodesToQuery.includes(station.code)
        );

        const measureName = mapMeasureNameToDomain(measureToQueryCode.split("-")[0])

        stations.forEach((station) => {
          const { codigo, nome, estado, regiao,valor } =
            station;

            if (!stationsWithMeasures.has(codigo)) {
              stationsWithMeasures.set(codigo, {
                code:codigo,
                name:nome,
                state:estado,
                country:regiao,
              });
            }
    
            stationsWithMeasures.set(
              codigo,
              Object.assign(stationsWithMeasures.get(codigo), {
                [measureName]: valor,
              })
            );
        })

      }
    }

    return [...stationsWithMeasures.values()];
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

    const stationsWithMeasures = await this.getStationsWithMeasures(
      measuresCodes
    );

    await this.closeBrowser();

    return stationsWithMeasures
  }
}
