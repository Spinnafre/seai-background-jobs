import { StationMapper } from "../../../../../jobs/scrapper/core/mappers/station-mapper.js";
import scrapperConfig from "../../../../../config/scrapper-directories.js";
import { MetereologicalEquipmentDao } from "../../external/database/postgreSQL/data/equipments.js";
import { StationReadDao } from "../../external/database/postgreSQL/data/station.js";
import { StationParser } from "../../helpers/parser/station-parser.js";
import { FetchFuncemeData } from "../../helpers/fetch-data/fetch-data.js";
import { ExtractStationsFromFunceme } from "../../services/stations-measures/stations-measures-data-miner.js";
// import FtpClientAdapter from "../adapters/ftp-adapter-factory.js";

export const stationDataMinerFactory = (FtpClientAdapter) => {
  const stationParser = new StationParser();

  const fetchFuncemeData = new FetchFuncemeData(
    FtpClientAdapter,
    stationParser,
    StationMapper,
    scrapperConfig.directories.station
  );

  const metereologicalEquipmentDao = new MetereologicalEquipmentDao();
  const stationDao = new StationReadDao();

  const stationDataMiner = new ExtractStationsFromFunceme(
    fetchFuncemeData,
    metereologicalEquipmentDao,
    stationDao
  );

  return stationDataMiner;
};
