import { FuncemeDataMinerController } from "../../cli/controllers/funcemeDataMiner.js";
import { FuncemeDataMinerServiceFactory } from "../services/funcemeDataMiner.js";

class FuncemeDataMinerControllerFactory {
  static create() {
    const service = FuncemeDataMinerServiceFactory.create();

    return new FuncemeDataMinerController(service);
  }
}

export { FuncemeDataMinerControllerFactory };
