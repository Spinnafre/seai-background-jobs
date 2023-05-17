import { Scrapper } from "../../infra/scrapper/webScrapper/adapters/puppeteer.js";
import { InmetDataMiner } from "../../infra/scrapper/webScrapper/InmetDataMiner.js";

import { MetereologicalEquipmentDao } from "../../infra/database/postgreSQL/entities/Equipment.js";

import { InmetLog } from "../../infra/database/postgreSQL/entities/InmetLog.js";

import { PluviometerReadDao } from "../../infra/database/postgreSQL/entities/pluviometer.js";
import { StationReadDao } from "../../infra/database/postgreSQL/entities/station.js";

import { StationDataMiner } from "../services/stationDataMiner.js";
import scrapperConfig from "../../config/scrapper.js";
export class InmetFactory {
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
    return new InmetLog();
  }

  buildServices() {
    const dataMiner = new InmetDataMiner(this.#scrapper);

    const metereologicalEquipment = new MetereologicalEquipmentDao();

    const stationDao = new StationReadDao();
    const pluviometerDao = new PluviometerReadDao();

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
