import { MetereologicalEquipmentRepository } from "../../external/database/model/Equipment";
import { ET0Repository } from "../../external/database/model/Et0";
import { StationReadRepository } from "../../external/database/model/StationRead";
import { CalcETO } from "../../services/calc-eto-by-date.js";

export const CalcEtoByDateService = () => {
  const equipmentRepository = new MetereologicalEquipmentRepository();
  const stationReadRepository = new StationReadRepository();
  const etoRepository = new ET0Repository();

  return new CalcETO(equipmentRepository, etoRepository, stationReadRepository);
};
