import {
  EtoRepositoryInMemory,
  MetereologicalEquipmentInMemory,
  StationReadRepositoryInMemory,
} from "../../database/inMemory/entities";

import { CalcETO } from "../../../../src/jobs/calc_eto/services/calc-eto-by-date.js";

export const CalcEtoByDateService = () => {
  return new CalcETO(
    new MetereologicalEquipmentInMemory(),
    new EtoRepositoryInMemory(),
    new StationReadRepositoryInMemory()
  );
};
