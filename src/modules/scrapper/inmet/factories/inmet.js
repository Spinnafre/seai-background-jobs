import { Scrapper } from "../../infra/scrapper/webScrapper/adapters/puppeteer.js";
import { InmetDataMiner } from "../../infra/scrapper/webScrapper/InmetDataMiner.js";

import { MetereologicalEquipmentDao } from "../../infra/database/postgreSQL/entities/Equipment.js";

import { InmetLog } from "../../infra/database/postgreSQL/entities/InmetLog.js";

import { PluviometerReadDao } from "../../infra/database/postgreSQL/entities/pluviometer.js";
import { StationReadDao } from "../../infra/database/postgreSQL/entities/station.js";

import { StationDataMiner } from "../services/stationDataMiner.js";
import scrapperConfig from "../../config/scrapper.js";

export default () => {
  const scrapper = new Scrapper({
    bypass: scrapperConfig.launchConfig.bypass,
    launch: scrapperConfig.launchConfig.launch,
    timeout: scrapperConfig.page.timeout,
    userAgent: scrapperConfig.launchConfig.userAgent,
  });

  const dataMiner = new InmetDataMiner(scrapper);

  const metereologicalEquipment = new MetereologicalEquipmentDao();

  const stationDao = new StationReadDao();
  const pluviometerDao = new PluviometerReadDao();

  const stationDataMiner = new StationDataMiner(
    dataMiner,
    metereologicalEquipment,
    stationDao,
    pluviometerDao
  );

  const logDao = new InmetLog();

  return {
    stationDataMiner,
    logs: logDao,
  };
};
