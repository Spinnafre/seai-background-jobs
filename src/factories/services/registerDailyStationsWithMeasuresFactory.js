import { StationsRepository } from "../../infra/database/postgreSQL/stations-repository.js";
import { ExtractStationsFromInmet } from "../../services/commands/extractStationsFromInmet.js";
import { RegisterDailyStationsWithMeasures } from "../../services/registerDailyStationsWithMeasures.js";
import { InmetScrapper } from "../../infra/scrapper/inmet-scrapper.js";

class DailyStationServiceFactory {
  static create() {
    const stationRepository = new StationsRepository();
    const getStationsFromInmetService = new ExtractStationsFromInmet(
      InmetScrapper
    );

    return new RegisterDailyStationsWithMeasures(
      getStationsFromInmetService,
      stationRepository
    );
  }
}

export { DailyStationServiceFactory };
