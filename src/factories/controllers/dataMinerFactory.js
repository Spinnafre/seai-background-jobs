import { DataMiner } from "../../cli/index.js";

import { FuncemeDataMinerServiceFactory } from "../services/funcemeDataMiner.js";
//import { InmetServiceFactory } from "../services/inmetDataMiner.js";

class DataMinerFactory {
  static create() {
    //const inmetDataMiner = FuncemeDataMinerServiceFactory.create();
    const funcemeDataMiner = FuncemeDataMinerServiceFactory.create();

    return new DataMiner({}, funcemeDataMiner);
  }
}

export { DataMinerFactory };
