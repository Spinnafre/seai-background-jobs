import { InmetScrapper } from "../infra/scrapper/inmet-scrapper.js";

class RegisterDailyStationsWithMeasures {
  #inmetScrapper;

  constructor(inmetScrapper) {
    this.#inmetScrapper = inmetScrapper;
  }

  async execute(params) {
    const inmetStations = await this.#inmetScrapper.getStations({
      params,
      timeout: 30000,
    });

    console.log(inmetStations);
  }
}

// export { RegisterDailyStationsWithMeasures };

const service = new RegisterDailyStationsWithMeasures(InmetScrapper);

await service.execute({
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
