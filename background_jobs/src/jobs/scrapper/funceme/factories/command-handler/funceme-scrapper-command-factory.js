import { stationDataMinerFactory } from "../services/stations-data-miner-factory.js";
import { pluviometerDataMinerFactory } from "../services/pluviometer-data-miner-factory.js";
import { FTPClientAdapter } from "../../external/adapters/ftp/client/ftp-client-adapter.js";
import { FuncemeScrapperCommand } from "../../command-handler/funceme-scrapper-command.js";
import { LogRepository } from "../../external/database/postgreSQL/data/log.js";

export const FuncemeScrapperCommandFactory = () => {
  const ftpClient = new FTPClientAdapter();
  return new FuncemeScrapperCommand(
    stationDataMinerFactory(ftpClient),
    pluviometerDataMinerFactory(ftpClient),
    ftpClient,
    new LogRepository()
  );
};
