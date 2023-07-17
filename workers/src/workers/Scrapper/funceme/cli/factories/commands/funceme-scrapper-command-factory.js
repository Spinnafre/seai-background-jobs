import { FuncemeScrapperCommand } from "../../commands/funceme-scrapper-command.js";
import { stationDataMinerFactory } from "../services/funceme-data-miner-factory.js";
import { pluviometerDataMinerFactory } from "../services/station-data-miner-factory.js";
import FtpClientAdapter from "../adapters/ftp-adapter-factory.js";
import { buildFuncemeDataMinerLogs } from "../logs-repository-factory.js";

export const funcemeScrapperCommandFactory = () => {
  return new FuncemeScrapperCommand(
    stationDataMinerFactory(),
    pluviometerDataMinerFactory(),
    FtpClientAdapter,
    buildFuncemeDataMinerLogs()
  );
};
