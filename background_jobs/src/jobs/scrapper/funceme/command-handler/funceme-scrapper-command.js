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
    let time = null;
    // const { id, data } = payload;
    if (payload?.data?.date) {
      time = payload?.data?.date;
    } else {
      // DD/MM/YYYY
      // data que será agendado o worker para buscar dados
      const current_date = new Date();

      // data que será passada para o worker realizar a busca
      // na fonte de dados
      const yesterday = new Date(current_date).setDate(
        current_date.getDate() - 1
      );

      current_date.setHours(22, 0, 0);

      //DD/MM/YYYY
      // const date = Intl.DateTimeFormat("pt-BR").format(yesterday);
      time = yesterday;
    }

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
