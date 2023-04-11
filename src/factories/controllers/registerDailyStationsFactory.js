import { RegisterDailyStationsController } from "../../cli/controllers/registerDailyStations.js";
import { DailyStationServiceFactory } from "../services/registerDailyStationsWithMeasuresFactory.js";

class DailyStationControllerFactory {
  static create() {
    const service = DailyStationServiceFactory.create();

    return new RegisterDailyStationsController(service);
  }
}

export { DailyStationControllerFactory };
