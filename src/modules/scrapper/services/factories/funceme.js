import { FuncemeDataMiner } from "../../infra/ftp/dataMiner.js";

import { MetereologicalEquipmentDao } from "../../infra/database/postgreSQL/dao/Equipments.js";

import { StationReadDao } from "../../infra/database/postgreSQL/dao/station.js";
import { FuncemeLog } from "../../infra/database/postgreSQL/dao/FuncemeLog.js";
import { PluviometerReadDao } from "../../infra/database/postgreSQL/dao/pluviometer.js";

import { ExtractPluviometersFromFunceme } from "../funceme/pluviometerDataMiner.js";
import { ExtractStationsFromFunceme } from "../funceme/stationDataMiner.js";

import { FTPClientAdapter } from "../../infra/ftp/connection/ftp.js";

import {
  equipmentsConnection,
  logsConnection,
} from "../../infra/database/postgreSQL/connection.js";

export class FuncemeFactory {
  #ftpClient;
  constructor() {
    this.#ftpClient = null;
  }

  buildConnection() {
    this.#ftpClient = new FTPClientAdapter();
    return this.#ftpClient;
  }

  buildLogs() {
    return new FuncemeLog(logsConnection);
  }

  buildServices() {
    const funcemeDataMiner = new FuncemeDataMiner(this.#ftpClient);

    const metereologicalEquipment = new MetereologicalEquipmentDao(
      equipmentsConnection
    );

    const stationDao = new StationReadDao(equipmentsConnection);
    const pluviometerDao = new PluviometerReadDao(equipmentsConnection);

    const pluviometerDataMiner = new ExtractPluviometersFromFunceme(
      funcemeDataMiner,
      metereologicalEquipment,
      pluviometerDao
    );

    const stationDataMiner = new ExtractStationsFromFunceme(
      funcemeDataMiner,
      metereologicalEquipment,
      stationDao
    );

    return {
      stationService: stationDataMiner,
      pluviometerService: pluviometerDataMiner,
    };
  }
}
