import { PluviometerMapper } from "../../../../core/mappers/pluviometer-mapper.js";
import scrapperConfig from "../../../../../../config/scrapper-directories.js";
import { MetereologicalEquipmentDao } from "../../../external/database/postgreSQL/data/equipments.js";
import { PluviometerReadDao } from "../../../external/database/postgreSQL/data/pluviometer.js";
import { PluviometerParser } from "../../../helpers/parser/pluviometer-parser.js";
import { FetchFuncemeData } from "../../../services/fetch-data/fetch-data.js";
import { ExtractStationsFromFunceme } from "../../../services/stations-measures/stations-measures-data-miner.js";
import FtpClientAdapter from "../adapters/ftp-adapter-factory.js";

export const pluviometerDataMinerFactory = () => {
  const pluviometerParser = new PluviometerParser();

  const fetchFuncemeData = new FetchFuncemeData(
    FtpClientAdapter,
    pluviometerParser,
    PluviometerMapper,
    scrapperConfig.directories.pluviometer
  );

  const metereologicalEquipmentDao = new MetereologicalEquipmentDao();
  const pluviometerDao = new PluviometerReadDao();

  const stationDataMiner = new ExtractStationsFromFunceme(
    fetchFuncemeData,
    metereologicalEquipmentDao,
    pluviometerDao
  );

  return stationDataMiner;
};
