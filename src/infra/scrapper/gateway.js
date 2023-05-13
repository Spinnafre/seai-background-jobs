"use strict";

import { mapMeasureNameToDomain } from "../../core/mappers/inmet/stationMap.js";

import scrapperConfig from '../../config/scrapper.js'

export class InmetDataMiner {
  #scrapper
  constructor(scrapper) {
    this.#scrapper = scrapper;
  }
  async getStations(params = {
    country: "",
    stations_type: "",
    stations_codes:[],
    state: "",
    date_type: "",
    measures_names: [],
  }) {
    const { country, stations_type,stations_codes, state,
      date_type, measures_names } = params

    await this.#scrapper.openNewTab()

    await this.#scrapper.navigateToUrl(scrapperConfig.page.url,scrapperConfig.page.timeout)

    await this.#scrapper.waitForElement(".sidebar", scrapperConfig.page.timeout)
  

    for(const {value,selector} of [
      { value: country, selector: "#estacao-regiao" },
      { value: stations_type, selector: "#estacao-tipo" },
      { value: date_type, selector: "#estacao-tipo-dados" }
    ]){
      await this.#scrapper.selectInputsValues(selector,value)
    }

    await this.#scrapper.waitForElement(".btn-green");

    // Get measures codes from measures names
    const measuresCodes = await this.#scrapper.pageEvaluate(measures_names, (params) => {
      const options = document.querySelector("#estacao-parametro").children;

      return Array.from(options)
        .filter((option) => params.includes(option.innerHTML))
        .map((option) => option.value);
    })


    if (!measuresCodes.length) {
      await this.#scrapper.closeBrowser();

      throw new Error(
        "Não foi possível obter identificadores dos parâmetros das medições das estações"
      );
    }

    const stationsWithMeasures = new Map();

    for (const measureToQueryCode of measuresCodes) {
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
          (station) => station.estado === state && stations_codes.includes(station.code)
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

    await this.closeBrowser();

    return [...stationsWithMeasures.values()]
  }
}
