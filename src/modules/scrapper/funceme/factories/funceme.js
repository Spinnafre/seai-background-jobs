import { FuncemeDataMiner } from "../../infra/scrapper/ftp/dataMiner.js";

import { MetereologicalEquipmentDao } from "../../infra/database/postgreSQL/entities/Equipment.js";

import { StationReadDao } from "../../infra/database/postgreSQL/entities/station.js";
import { FuncemeLog } from "../../infra/database/postgreSQL/entities/FuncemeLog.js";
import { PluviometerReadDao } from "../../infra/database/postgreSQL/entities/pluviometer.js";

import { ExtractPluviometersFromFunceme } from "../services/pluviometerDataMiner.js";
import { ExtractStationsFromFunceme } from "../services/stationDataMiner.js";

export default (client) => {
  const funcemeDataMiner = new FuncemeDataMiner(client);

  const metereologicalEquipment = new MetereologicalEquipmentDao();

  const stationDao = new StationReadDao();
  const pluviometerDao = new PluviometerReadDao();

  const pluviomerDataMiner = new ExtractPluviometersFromFunceme(
    funcemeDataMiner,
    metereologicalEquipment,
    pluviometerDao
  );

  const stationDataMiner = new ExtractStationsFromFunceme(
    funcemeDataMiner,
    metereologicalEquipment,
    stationDao
  );

  const logDao = new FuncemeLog();

  return {
    pluviomerDataMiner,
    stationDataMiner,
    logs: logDao,
  };
};
