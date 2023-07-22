import { FuncemeScrapperCommand } from "../../command-handler/funceme-scrapper-command.js";
import { stationDataMinerFactory } from "../services/funceme-data-miner-factory.js";
import { pluviometerDataMinerFactory } from "../services/station-data-miner-factory.js";
import FtpClientAdapter from "../adapters/ftp-adapter-factory.js";
import { LogRepository } from "../../external/database/postgreSQL/data/log.js";

export const FuncemeScrapperCommandFactory = () => {
  return new FuncemeScrapperCommand(
    stationDataMinerFactory(),
    pluviometerDataMinerFactory(),
    FtpClientAdapter,
    new LogRepository()
  );
};
