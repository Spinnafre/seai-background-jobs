import { FuncemeFtpDataMinerController } from "../../../../src/modules/funceme/controller/funceme-ftp-data-miner-controller.js";
import { FTPClientAdapterMock } from "../../mock/funceme/ftp/connection.js";
import { DatabaseLoggerInMemoryFactory } from "../../services/logger/databaseLoggerFactory.js";
import { makeFetchFtpCredentials } from "../services/funceme/fetch-ftp-credentials.js";

export const makeFetchFuncemeMeasuresController = () => {
  const ftpClientAdapter = new FTPClientAdapterMock();

  const controller = new FuncemeFtpDataMinerController(
    ftpClientAdapter,
    DatabaseLoggerInMemoryFactory.makeFuncemeLogger(),
    makeFetchFtpCredentials()
  );

  controller.setService(makeFetchFuncemeStationsMeasures(ftpClientAdapter));
  controller.setService(makeFetchFuncemePluviometerMeasures(ftpClientAdapter));

  return controller;
};
