import { FetchEquipments } from "./fetch-equipments.js";
import { makeFetchFuncemeEquipments } from "../../data/funceme/services/fetch-equipments-service.factory.js";
import { MetereologicalEquipmentRepository } from "../../data/database/repositories/equipment.js";

export const makeFetchEquipments = () => {
  return new FetchEquipments(
    makeFetchFuncemeEquipments(),
    new MetereologicalEquipmentRepository()
  );
};
