import { FuncemeDataMinerDTO } from "../protocols/dto.js";

import { FuncemeFactory } from "../factories/funceme.js";

export class FuncemeScrapper {
  static name_queue = "funceme-scrapper";

  async handler(payload) {
    const { id, data } = payload;

    const time = data.date;

    const factory = new FuncemeFactory();
    console.log("REQUEST => ", date);
    const ftpClient = factory.buildConnection();
    const logs = factory.buildLogs();

    const ftpConnectionOrError = await ftpClient.connect();

    // Deu erro na conexão, então nem executa nada e sai do ciclo
    if (ftpConnectionOrError.connected === false) {
      await logs.create(ftpConnectionOrError.message);
      await ftpClient.close();
      throw new Error(ftpConnectionOrError.message);
    }

    const { stationService, pluviometerService } = factory.buildServices();

    const dto = new FuncemeDataMinerDTO(time);

    await stationService.execute(dto);
    await logs.create(stationService.getLogs());

    await pluviometerService.execute(dto);
    await logs.create(pluviometerService.getLogs());

    await ftpClient.close();
  }
}
