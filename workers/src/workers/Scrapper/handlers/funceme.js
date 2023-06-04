import { FuncemeDataMinerDTO } from "../protocols/dto.js";

import { FuncemeFactory } from "../factories/funceme.js";

export class FuncemeScrapper {
  static name_queue = "funceme-scrapper";
  static timeout = 15000;

  static async runner(time) {
    const logs = FuncemeFactory.buildLogs();

    console.log("REQUEST => ", time);

    const { stationService, pluviometerService } =
      FuncemeFactory.buildServices();

    const dto = new FuncemeDataMinerDTO(time);

    await stationService.execute(dto);

    await pluviometerService.execute(dto);

    await logs.create(stationService.getLogs());
    await logs.create(pluviometerService.getLogs());
  }

  async handler(payload) {
    const { id, data } = payload;

    const time = data.date;

    const ftpClient = FuncemeFactory.buildConnection();
    try {
      const ftpConnectionOrError = await ftpClient.connect();

      // Deu erro na conexão, então nem executa nada e sai do ciclo
      if (ftpConnectionOrError.connected === false) {
        console.error("[FUNCEME] - ", ftpConnectionOrError.message);
        const logs = FuncemeFactory.buildLogs();
        await logs.create(ftpConnectionOrError.message);
        await ftpClient.close();
        throw new Error(ftpConnectionOrError.message);
      }

      const timeoutPromise = new Promise((resolve, reject) => {
        setTimeout(
          reject,
          FuncemeScrapper.timeout,
          new Error(
            `Exceeded the tolerance time limit ${FuncemeScrapper.timeout}`
          )
        );
      });

      await Promise.race([FuncemeScrapper.runner(time), timeoutPromise]);

      await ftpClient.close();
    } catch (error) {
      console.error("[ERROR] - Falha ao executar worker da funceme.");
      console.error(error);
      await ftpClient.close();
      throw error;
    }
  }
}
