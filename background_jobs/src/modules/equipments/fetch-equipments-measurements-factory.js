import { MetereologicalEquipmentRepository } from "../../shared/database/repositories/Equipment.js";
import { CalcETOService } from "../calc-eto/services/calc-eto-by-date-v2.js";
import { FetchEquipmentsMeasures } from "./fetch-equipments-measurements-facade.js";
import { makeFetchFuncemeEquipments } from "./funceme/services/fetch-equipments-service.factory.js";

export const makeFetcEquipmentsMeasurements = () => {
  return new FetchEquipmentsMeasures(
    makeFetchFuncemeEquipments(),
    new MetereologicalEquipmentRepository(),
    new CalcETOService()
  );
};
