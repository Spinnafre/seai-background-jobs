import { makeCalcETOPerDayController } from "../../../modules/calc-eto/factories/controllers/calc-eto-per-day.js";
import { CalcET0Worker } from "../../handlers/calc_eto/handler.js";

export const makeCalcEtoWorkerHandler = () => {
  return new CalcET0Worker(makeCalcETOPerDayController());
};
