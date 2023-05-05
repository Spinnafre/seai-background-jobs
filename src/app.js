import { getYesterdayTimestamp } from "./utils/index.js";

class Application {
  #logs = [];

  #commands = [];

  #dataMinerDate = null;

  #readTimeRepository;
  #logsRepository;

  addCommand(command) {}

  async setDataMinerDate() {
    try {
      const yesterdayDate = getYesterdayTimestamp();

      let date = await this.#readTimeRepository.getLastDate();

      // Evitar salvar dados no banco com datas repetidas
      if (
        !date ||
        formatDateToForwardSlash(date.Time) !==
          formatDateToForwardSlash(yesterdayDate)
      ) {
        const id = await this.#readTimeRepository.create(yesterdayDate);

        this.#dataMinerDate = {
          IdTime: id,
          Time: yesterdayDate,
        };
      }
    } catch (error) {
      // Registrar nos logs
      console.error(`Erro ao definir data de realização de buscas - `, error);
    }
  }

  async run() {
    if (!this.#dataMinerDate) {
      console.log(
        "É necessário informa uma data para realizar a busca por medições"
      );
      return;
    }
    for (const command of this.#commands) {
      await command.execute(this.#dataMinerDate);
    }
  }

  //Proxy
  async execute(command) {
    try {
      const result = await command.execute();
      // push command result to log
    } catch (error) {
      // push command error to log
    }
  }
}

export { Application };
