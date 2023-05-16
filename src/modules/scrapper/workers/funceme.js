import { FTPClientAdapter } from "../infra/scrapper/ftp/connection/ftp.js";

import { FuncemeDataMinerDTO } from "../core/dto.js";

import serviceFactory from "../funceme/factories/funceme.js";

export class FuncemeDataMinerHandler {
  // params = timestamp
  static async run({ timestamp }) {
    const ftpClient = FTPClientAdapter.create();

    const ftpConnectionOrError = await ftpClient.connect();

    // Deu erro na conexão, então nem executa nada e sai do ciclo
    if (ftpConnectionOrError.connected === false) {
      await this.#funcemeLogs(ftpConnectionOrError.message);
      return;
    }

    const funceme = serviceFactory(ftpClient);

    const dto = new FuncemeDataMinerDTO(timestamp);

    await funceme.stationDataMiner.execute(dto);
    await funceme.logs.create(funceme.stationDataMiner.getLogs());

    await funceme.pluviomerDataMiner.execute(dto);
    await funceme.logs.create(funceme.pluviomerDataMiner.getLogs());

    await ftpClient.close();
  }
}
