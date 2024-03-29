import { MetereologicalEquipmentRepository } from "../../shared/database/repositories/Equipment.js";
import { FetchEquipments } from "./fetch-equipments-facade.js";
import { makeFetchFuncemeEquipments } from "./funceme/services/fetch-equipments-service.factory.js";

export const makeFetcEquipments = () => {
  return new FetchEquipments(
    makeFetchFuncemeEquipments(),
    new MetereologicalEquipmentRepository()
  );
};
