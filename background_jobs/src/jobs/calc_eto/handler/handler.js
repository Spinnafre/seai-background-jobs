import { CalcEtoDTO } from "./input-boundary.js";

// import { config } from "dotenv";

// config({
//   path: "../../.env",
// });

import { Logger } from "../../../lib/logger/logger.js";
export class CalcET0Handler {
  static name_queue = "cal-et0";
  calcEtoByDay;
  dbLogger;

  constructor(calcEtoByDay, dbLogger) {
    this.calcEtoByDay = calcEtoByDay;
    this.dbLogger = dbLogger;
    this.name_queue = CalcET0Handler.name_queue;
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

      Logger.info({
        msg: `Current date : ${current_date.getTime()}, Date to search data : ${yesterday}`,
      });

      //DD/MM/YYYY
      // const date = Intl.DateTimeFormat("pt-BR").format(yesterday);
      time = yesterday;
    }

    const dto = new CalcEtoDTO(time);

    try {
      await this.calcEtoByDay.execute(dto);

      await this.dbLogger.add(this.calcEtoByDay.getLogs());
    } catch (error) {
      Logger.error({
        msg: "Falha ao executar worker da funceme.",
        obj: error,
      });

      await this.dbLogger.add({
        message: error.message,
        type: "error",
      });

      //Essencial para o PG-BOSS entender que ocorreu um erro
      throw error;
    }
  }
}
