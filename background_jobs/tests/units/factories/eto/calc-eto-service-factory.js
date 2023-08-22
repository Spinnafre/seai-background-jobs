import {
  EtoRepositoryInMemory,
  MetereologicalEquipmentInMemory,
  StationReadRepositoryInMemory,
} from "../../database/inMemory/entities";

import { CalcETO } from "../../../../src/jobs/calc_eto/services/calc-eto-by-date.js";

export const CalcEtoByDateService = () => {
  const equipmentRepository = new MetereologicalEquipmentInMemory();
  const stationReadRepository = new StationReadRepositoryInMemory();
  const etoRepository = new EtoRepositoryInMemory();

  return new CalcETO(equipmentRepository, etoRepository, stationReadRepository);
};
