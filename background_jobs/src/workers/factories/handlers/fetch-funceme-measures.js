import { makeFetchFuncemeMeasuresController } from "../../../modules/funceme/factories/controllers/fetch-funceme-measures";
import { FuncemeFTPDataMinerWorker } from "../../handlers/funceme/handler";

export const makeFetchFuncemeMeasuresHandler = () => {
  return new FuncemeFTPDataMinerWorker(makeFetchFuncemeMeasuresController());
};
