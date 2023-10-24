import scrapperConfig from "../../../../../config/scrapper-directories.js";

import {
  PluviometerReadRepository,
  MetereologicalEquipmentRepository,
} from "../../../../shared/database/repositories/index.js";

import { PluviometerMapper } from "../../../core/mappers/pluviometer-mapper.js";
import { FetchFuncemeData } from "../../helpers/fetch-data/fetch-data.js";
import { PluviometerParser } from "../../helpers/parser/pluviometer-parser.js";
import { ExtractPluviometersFromFunceme } from "../../services/pluviometers-measures/pluviometers-measures-data-miner.js";
// import FtpClientAdapter from "../adapters/ftp-adapter-factory.js";

export const pluviometerDataMinerFactory = (FtpClientAdapter) => {
  const pluviometerParser = new PluviometerParser();

  const fetchFuncemeData = new FetchFuncemeData(
    FtpClientAdapter,
    pluviometerParser,
    PluviometerMapper,
    scrapperConfig.directories.pluviometer
  );

  const stationDataMiner = new ExtractPluviometersFromFunceme(
    fetchFuncemeData,
    new MetereologicalEquipmentRepository(),
    new PluviometerReadRepository()
  );

  return stationDataMiner;
};
