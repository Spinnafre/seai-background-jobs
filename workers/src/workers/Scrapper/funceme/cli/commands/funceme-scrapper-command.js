import { FuncemeDataMinerDTO } from "./input-boundary.js";

export class FuncemeScrapperCommand {
  static name_queue = "funceme-scrapper";
  static timeout = 30000;

  constructor(stationDataMiner, pluviometerDataMiner, ftpClient, logs) {
    this.stationDataMiner = stationDataMiner;
    this.pluviometerDataMiner = pluviometerDataMiner;
    this.ftpClient = ftpClient;
    this.logs = logs;
    this.name_queue = "funceme-scrapper";
  }

  async runAllServices(dto) {
    console.log("REQUEST => ", dto);

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
        new Error(
          `Exceeded the tolerance time limit ${FuncemeScrapperCommand.timeout}`
        )
      );
    });
  }

  async handler(payload) {
    const { id, data } = payload;

    const time = data.date;

    console.log("TIME = ", time);

    const dto = new FuncemeDataMinerDTO(time);

    try {
      await this.ftpClient.connect();

      await Promise.race([this.runAllServices(dto), this.timeout()]);

      await this.ftpClient.close();
    } catch (error) {
      console.error("[ERROR] - Falha ao executar worker da funceme.");
      console.error(error);

      await this.logs.create(error.message);

      await this.ftpClient.close();

      //Essencial para o PG-BOSS entender que ocorreu um erro
      throw error;
    }
  }
}
