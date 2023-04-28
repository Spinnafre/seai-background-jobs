import { StationsRepository } from "../../infra/database/postgreSQL/stations-repository.js";
import { ExtractStationsFromInmet } from "../../services/extractStationsFromInmet.js";
import { InmetDataMinerService } from "../../services/inmetDataMiner.js";
import { InmetScrapper } from "../../infra/scrapper/inmet-scrapper.js";

class InmetServiceFactory {
  static create() {
    const stationRepository = new StationsRepository();
    const getStationsFromInmetService = new ExtractStationsFromInmet(
      InmetScrapper
    );

    return new InmetDataMinerService(
      getStationsFromInmetService,
      stationRepository
    );
  }
}

export { InmetServiceFactory };
