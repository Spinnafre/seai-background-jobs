import path from "node:path";
import { config } from "dotenv";

config({
  path: "../../.env",
});

import { TimeoutError } from "./errors/TimeoutError.js";
import { FuncemeDataMinerDTO } from "./input-boundary.js";
import { dbConfig } from "../../../../config/database.js";

export class FuncemeScrapperCommand {
  static name_queue = "funceme-scrapper";
  static timeout = 20000;

  // ftpClient = null;

  constructor(stationDataMiner, pluviometerDataMiner, ftpClient, logs) {
    this.stationDataMiner = stationDataMiner;
    this.pluviometerDataMiner = pluviometerDataMiner;
    this.ftpClient = ftpClient;
    this.logs = logs;
    this.name_queue = FuncemeScrapperCommand.name_queue;
  }

  async runAllServices(dto) {
    await this.stationDataMiner.execute(dto);

    await this.pluviometerDataMiner.execute(dto);

    await this.logs.create(this.stationDataMiner.getLogs());
    await this.logs.create(this.pluviometerDataMiner.getLogs());
  }

  async timeout() {
    return new Promise((_, reject) => {
      setTimeout(
        reject,
        FuncemeScrapperCommand.timeout,
        new TimeoutError(FuncemeScrapperCommand.timeout)
      );
    });
  }

  async handler(payload) {
    console.log(process.env);
    console.log("dbConfig ", dbConfig());
    // const { id, data } = payload;
    // DD/MM/YYYY
    const time = payload?.data?.date || new Date();

    console.log(
      `[LOG] Iniciando busca de dados do ftp da FUNCEME pela data ${time}`
    );

    const dto = new FuncemeDataMinerDTO(time);

    try {
      await this.ftpClient.connect();

      await Promise.race([this.runAllServices(dto), this.timeout()]);

      await this.ftpClient.close();
    } catch (error) {
      console.error("[ERROR] - Falha ao executar worker da funceme.");
      console.error(error);

      await this.ftpClient.close();

      await this.logs.create({
        message: error.message,
        type: "error",
      });

      //Essencial para o PG-BOSS entender que ocorreu um erro
      throw error;
    }
  }
}
