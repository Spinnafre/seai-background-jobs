import { CalcETOByDate } from "../../services/calc-eto-by-date.js";
import {
  MetereologicalEquipmentRepository,
  StationReadRepository,
  ET0Repository,
} from "../../../../shared/database/repositories/index.js";

export const makeCalcEtoByDateService = () => {
  const equipmentRepository = new MetereologicalEquipmentRepository();
  const stationReadRepository = new StationReadRepository();
  const etoRepository = new ET0Repository();

  return new CalcETOByDate(
    equipmentRepository,
    etoRepository,
    stationReadRepository
  );
};
