import { StationMapper } from "../../../../../jobs/scrapper/core/mappers/station-mapper.js";
import scrapperConfig from "../../../../../config/scrapper-directories.js";
import { StationParser } from "../../helpers/parser/station-parser.js";
import { FetchFuncemeData } from "../../helpers/fetch-data/fetch-data.js";
import { ExtractStationsFromFunceme } from "../../services/stations-measures/stations-measures-data-miner.js";
// import FtpClientAdapter from "../adapters/ftp-adapter-factory.js";

import {
  StationReadRepository,
  MetereologicalEquipmentRepository,
} from "../../../../shared/database/repositories/index.js";

export const stationDataMinerFactory = (FtpClientAdapter) => {
  const stationParser = new StationParser();

  const fetchFuncemeData = new FetchFuncemeData(
    FtpClientAdapter,
    stationParser,
    StationMapper,
    scrapperConfig.directories.station
  );

  const stationDataMiner = new ExtractStationsFromFunceme(
    fetchFuncemeData,
    new MetereologicalEquipmentRepository(),
    new StationReadRepository()
  );

  return stationDataMiner;
};
