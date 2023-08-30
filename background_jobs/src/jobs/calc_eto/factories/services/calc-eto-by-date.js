import { MetereologicalEquipmentRepository } from "../../external/database/model/Equipment.js";
import { ET0Repository } from "../../external/database/model/Et0.js";
import { LogRepository } from "../../external/database/model/Log.js";
import { StationReadRepository } from "../../external/database/model/StationRead.js";
import { CalcETO } from "../../services/calc-eto-by-date.js";

export const CalcEtoByDateServiceFactory = () => {
  const equipmentRepository = new MetereologicalEquipmentRepository();
  const stationReadRepository = new StationReadRepository();
  const etoRepository = new ET0Repository();
  const logRepository = new LogRepository();

  return new CalcETO(
    equipmentRepository,
    etoRepository,
    stationReadRepository,
    logRepository
  );
};
