import { LogRepository } from "../database/repositories/index.js";
import { CalcETOLogger, FuncemeDataMinerLogger } from "./log-register.js";

export class DatabaseLoggerFactory {
  static makeFuncemeLogger() {
    return new FuncemeDataMinerLogger(new LogRepository());
  }

  static makeCalcEtoLogger() {
    return new CalcETOLogger(new LogRepository());
  }
}
