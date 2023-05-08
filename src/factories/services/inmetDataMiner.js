import { InmetDataMinerService } from "../../services/inmetDataMiner.js";
import { InmetScrapper } from "../../infra/scrapper/inmet-scrapper.js";

class InmetServiceFactory {
  static create() {
    const metereologicalEquipmentDao = {};
    const stationReadDao = {};

    return new InmetDataMinerService(
      InmetScrapper,
      metereologicalEquipmentDao,
      stationReadDao
    );
  }
}

export { InmetServiceFactory };
