import { makeFetchFuncemeMeasuresController } from "../../../modules/funceme/factories/controllers/fetch-funceme-measures.js";
import { FuncemeFTPDataMinerWorker } from "../../handlers/funceme/handler.js";

export const makeFetchFuncemeMeasuresHandler = () => {
  return new FuncemeFTPDataMinerWorker(makeFetchFuncemeMeasuresController());
};
