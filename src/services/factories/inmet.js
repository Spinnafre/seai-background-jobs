import { Scrapper } from "../../infra/webScrapper/adapters/puppeteer.js";
import { InmetDataMiner } from "../../infra/webScrapper/InmetDataMiner.js";

import { MetereologicalEquipmentDao } from "../../infra/database/postgreSQL/dao/Equipments.js";

import { InmetLog } from "../../infra/database/postgreSQL/dao/InmetLog.js";

import { PluviometerReadDao } from "../../infra/database/postgreSQL/dao/pluviometer.js";
import { StationReadDao } from "../../infra/database/postgreSQL/dao/station.js";

import { StationDataMiner } from "../../services/inmet/stationDataMiner.js";
import scrapperConfig from "../../config/scrapper.js";

import {
  equipmentsConnection,
  logsConnection,
} from "../../infra/database/postgreSQL/connection.js";

export class InmetFactory {
  #scrapper;
  constructor() {
    this.#scrapper = null;
  }

  buildConnection() {
    this.#scrapper = new Scrapper({
      bypass: scrapperConfig.launchConfig.bypass,
      launch: scrapperConfig.launchConfig.launch,
      timeout: scrapperConfig.page.timeout,
      userAgent: scrapperConfig.launchConfig.userAgent,
    });
  }

  buildLogs() {
    return new InmetLog(logsConnection);
  }

  buildServices() {
    const dataMiner = new InmetDataMiner(this.#scrapper);

    const metereologicalEquipment = new MetereologicalEquipmentDao(
      equipmentsConnection
    );

    const stationDao = new StationReadDao(equipmentsConnection);
    const pluviometerDao = new PluviometerReadDao(equipmentsConnection);

    const stationDataMiner = new StationDataMiner(
      dataMiner,
      metereologicalEquipment,
      stationDao,
      pluviometerDao
    );

    return {
      service: stationDataMiner,
    };
  }
}
