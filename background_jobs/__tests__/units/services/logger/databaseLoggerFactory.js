import { CalcETOLogger, FuncemeDataMinerLogger } from "../../../../src/shared/services/log-register.js";
import { LogsRepositoryInMemory } from "../../mock/repositories/inMemory/entities/logs.js";

export class DatabaseLoggerInMemoryFactory {
  static makeFuncemeLogger() {
    return new FuncemeDataMinerLogger(new LogsRepositoryInMemory());
  }

  static makeCalcEtoLogger() {
    return new CalcETOLogger(new LogsRepositoryInMemory());
  }
}
