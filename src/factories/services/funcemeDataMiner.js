import { FTPClientAdapter } from "../../infra/ftp/connections/ftp.js";
import { FuncemeGateway } from "../../infra/ftp/gateway/funceme.js";
import { FuncemeDataMiner } from "../../services/funcemeDataMiner.js";

class FuncemeDataMinerServiceFactory {
  static create() {
    const ftp = new FTPClientAdapter();
    const gateway = new FuncemeGateway(ftp);
    const repository = {};

    return new FuncemeDataMiner(gateway, repository);
  }
}

export { FuncemeDataMinerServiceFactory };
