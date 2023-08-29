import {
  EtoRepositoryInMemory,
  MetereologicalEquipmentInMemory,
  StationReadRepositoryInMemory,
} from "../../database/inMemory/entities";

import { CalcETO } from "../../../../src/jobs/calc_eto/services/calc-eto-by-date.js";
import { LogsRepositoryInMemory } from "../../database/inMemory/entities/logs";

export const CalcEtoByDateService = () => {
  return new CalcETO(
    new MetereologicalEquipmentInMemory(),
    new EtoRepositoryInMemory(),
    new StationReadRepositoryInMemory(),
    new LogsRepositoryInMemory()
  );
};
