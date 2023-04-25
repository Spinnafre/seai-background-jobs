import { InmetDataMinerController } from "../../cli/controllers/inmetDataMiner.js";
import { InmetServiceFactory } from "../services/inmetDataMiner.js";

class InmetDataMinerControllerFactory {
  static create() {
    const service = InmetServiceFactory.create();

    return new InmetDataMinerController(service);
  }
}

export { InmetDataMinerControllerFactory };
