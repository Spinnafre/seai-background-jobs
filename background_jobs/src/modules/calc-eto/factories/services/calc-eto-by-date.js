import { CalcETOByDate } from "../../services/calc-eto-by-date.js";
import {
  MetereologicalEquipmentRepository,
  StationReadRepository,
} from "../../../../shared/database/repositories/index.js";

export const makeCalcEtoByDateService = () => {
  const equipmentRepository = new MetereologicalEquipmentRepository();
  const stationReadRepository = new StationReadRepository();

  return new CalcETOByDate(equipmentRepository, stationReadRepository);
};
