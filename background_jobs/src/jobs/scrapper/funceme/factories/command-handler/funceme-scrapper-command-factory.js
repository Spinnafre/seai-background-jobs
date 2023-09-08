import { stationDataMinerFactory } from "../services/stations-data-miner-factory.js";
import { pluviometerDataMinerFactory } from "../services/pluviometer-data-miner-factory.js";
import { FTPClientAdapter } from "../../external/adapters/ftp/client/ftp-client-adapter.js";
import { FuncemeScrapperCommand } from "../../command-handler/funceme-scrapper-command.js";
import { LogRepository } from "../../../../shared/database/repositories/Log.js";
import { FuncemeDataMinerLogger } from "../../../../../lib/logger/log-register.js";
import { MetereologicalOrganRepository } from "../../../../shared/database/repositories/MetereologicalOrgan.js";

export const FuncemeScrapperCommandFactory = () => {
  const ftpClient = new FTPClientAdapter();
  return new FuncemeScrapperCommand(
    stationDataMinerFactory(ftpClient),
    pluviometerDataMinerFactory(ftpClient),
    ftpClient,
    new FuncemeDataMinerLogger(new LogRepository()),
    new MetereologicalOrganRepository()
  );
};
