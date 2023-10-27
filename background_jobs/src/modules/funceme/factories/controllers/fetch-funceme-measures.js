import { DatabaseLoggerFactory } from "../../../../shared/services/log-register-factory.js";
import { FuncemeFtpDataMinerController } from "../../controller/funceme-ftp-data-miner-controller.js";
import { FTPClientAdapter } from "../../external/adapters/ftp/client/ftp-client-adapter.js";
import { makeFetchFtpCredentials } from "../services/fetch-ftp-credentials.js";
import { makeFetchFuncemePluviometerMeasures } from "../services/fetch-funceme-pluviometers-measures.js";
import { makeFetchFuncemeStationsMeasures } from "../services/fetch-funceme-stations-measures.js";

export const makeFetchFuncemeMeasuresController = () => {
  const ftpClientAdapter = new FTPClientAdapter();

  const controller = new FuncemeFtpDataMinerController(
    ftpClientAdapter,
    DatabaseLoggerFactory.makeFuncemeLogger(),
    makeFetchFtpCredentials()
  );

  controller.setService(makeFetchFuncemeStationsMeasures(ftpClientAdapter));
  controller.setService(makeFetchFuncemePluviometerMeasures(ftpClientAdapter));

  return controller;
};
