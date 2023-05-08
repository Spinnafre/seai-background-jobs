import { setTimeout } from "node:timers/promises";
import scrapperConfig from "../../config/scrapper.js";

export class InmetDataMiner {
  constructor(inmetScrapper, metereologicalEquipmentDao, stationReadDao) {
    this.inmetScrapper = inmetScrapper;
    this.metereologicalEquipmentDao = metereologicalEquipmentDao;
    this.stationReadDao = stationReadDao;
  }

  async execute(params) {
    try {
      const stations = await this.metereologicalEquipmentDao.getInmetStations();

      if (!stations.length) {
        params.commandLogs.addErrorLog("Não há estações do INMET cadastradas");
        return;
      }

      const codes = stations.map((station) => station.code);

      const timeoutPromise = new Promise((resolve, reject) => {
        setTimeout(
          reject,
          scrapperConfig.toleranceTime,
          new Error(
            `Exceeded the tolerance time limit ${scrapperConfig.toleranceTime}`
          )
        );
      });

      const measures = await Promise.race([
        this.inmetScrapper.getStationsWithMeasures(codes, params.getDate()),
        timeoutPromise,
      ]);

      if (measures.length) {
        params.commandLogs.addInfoLog(
          "[✅] Sucesso ao obter dados das medições das estações do INMET"
        );
      }

      await this.stationReadDao.create(stations, measures, params.idTimestamp);
    } catch (error) {
      console.error(error);
      params.commandLogs.addErrorLog(error.message);
    }
  }
}
