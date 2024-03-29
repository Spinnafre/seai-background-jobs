import { makeFetcEquipments } from "../../../modules/equipments/fetch-equipments-facade.factory.js";
import { FuncemeFTPWorker } from "../../handlers/funceme/handler.js";

export const makeFetchFuncemeMeasuresHandler = () => {
  return new FuncemeFTPWorker(makeFetcEquipments());
};
