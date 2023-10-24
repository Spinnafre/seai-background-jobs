import { DatabaseLoggerFactory } from "../../../../shared/services/log-register-factory.js";
import { CalcETOPerDayController } from "../../controllers/calc-eto-per-day.js";
import { makeCalcEtoByDateService } from "../services/calc-eto-by-date.js";

export const makeCalcETOPerDayController = () => {
  return new CalcETOPerDayController(
    makeCalcEtoByDateService(),
    DatabaseLoggerFactory.makeCalcEtoLogger()
  );
};
