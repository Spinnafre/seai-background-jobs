import {
  ET0Repository,
  MetereologicalEquipmentRepository,
  StationReadRepository,
} from "../../../shared/database/repositories/index.js";

import { CalcETO } from "../../services/calc-eto-by-date.js";

export const CalcEtoByDateServiceFactory = () => {
  const equipmentRepository = new MetereologicalEquipmentRepository();
  const stationReadRepository = new StationReadRepository();
  const etoRepository = new ET0Repository();

  return new CalcETO(equipmentRepository, etoRepository, stationReadRepository);
};
