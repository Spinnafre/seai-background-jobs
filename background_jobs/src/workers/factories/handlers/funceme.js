import { makeFetcEquipments } from "../../../modules/equipments/fetch-equipments-facade.factory.js";
import { FuncemeFuncemeEquipmentsWorker } from "../../handlers/funceme/handler.js";
import { makeFetcEquipmentsMeasurements } from "../../../modules/equipments/fetch-equipments-measurements-factory.js";
import { FetchFuncemeMeasurementsWorker } from "../../handlers/funceme/handler.js";

export const makeFetchFuncemeEquipmentsHandler = () => {
  return new FuncemeFuncemeEquipmentsWorker(makeFetcEquipments());
};

export const makeFetchFuncemeMeasurementsHandler = () => {
  return new FetchFuncemeMeasurementsWorker(makeFetcEquipmentsMeasurements());
};
