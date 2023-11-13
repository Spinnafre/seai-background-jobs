import { makeFetchFuncemeMeasuresController } from "../../../modules/funceme/factories/controllers/fetch-funceme-measures.js";
import { makeCalcETOPerDayController } from "../../../modules/calc-eto/factories/controllers/calc-eto-per-day.js";
import { FuncemeFTPWorker } from "../../handlers/funceme/handler.js";

export const makeFetchFuncemeMeasuresHandler = () => {
  return new FuncemeFTPWorker(
    makeFetchFuncemeMeasuresController(),
    makeCalcETOPerDayController()
  );
};
