// import { LogRepository } from "../../external/database/model/log.js";

import { CalcET0 } from "../../handler/handler.js";
import { CalcEtoByDateService } from "../services/calc-eto-by-date.js";

export const CalcEtoHandler = () => {
  return new CalcET0(CalcEtoByDateService());
};
