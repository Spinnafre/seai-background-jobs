import { FetchEquipmentsMeasures } from "./fetch-measurements.js";
import { makeFetchFuncemeEquipments } from "../../data/funceme/services/fetch-equipments-service.factory.js";
import { MetereologicalEquipmentRepository } from "../../data/database/repositories/equipment.js";

export const makeFetchEquipmentsMeasurements = () => {
  return new FetchEquipmentsMeasures(
    makeFetchFuncemeEquipments(),
    new MetereologicalEquipmentRepository()
  );
};
