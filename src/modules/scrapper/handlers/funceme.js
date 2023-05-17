import { FuncemeDataMinerDTO } from "../core/dto.js";

import { FuncemeFactory } from "../funceme/factories/funceme.js";

export class FuncemeDataMinerHandler {
  #factory;
  constructor() {
    this.#factory = new FuncemeFactory();
  }

  async run(timestamp) {
    const ftpClient = this.#factory.buildConnection();
    const logs = this.#factory.buildLogs();

    const ftpConnectionOrError = await ftpClient.connect();

    // Deu erro na conexão, então nem executa nada e sai do ciclo
    if (ftpConnectionOrError.connected === false) {
      await logs.create(ftpConnectionOrError.message);
      throw new Error(ftpConnectionOrError.message);
    }

    const { stationService, pluviometerService } =
      this.#factory.buildServices();

    const dto = new FuncemeDataMinerDTO(timestamp);

    await stationService.execute(dto);
    await logs.create(stationService.getLogs());

    await pluviometerService.execute(dto);
    await logs.create(pluviometerService.getLogs());

    await ftpClient.close();
  }
}
