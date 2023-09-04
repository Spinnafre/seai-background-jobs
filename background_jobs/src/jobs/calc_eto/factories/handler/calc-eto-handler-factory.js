import { LogRepository } from "../../../shared/database/repositories/index.js";
import { CalcET0Handler } from "../../handler/handler.js";
import { CalcEtoByDateServiceFactory } from "../services/calc-eto-by-date.js";

export const CalcEtoHandlerFactory = () => {
  return new CalcET0Handler(CalcEtoByDateServiceFactory(), new LogRepository());
};
