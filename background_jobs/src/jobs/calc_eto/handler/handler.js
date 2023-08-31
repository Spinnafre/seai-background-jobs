import { CalcEtoDTO } from "./input-boundary.js";

import { config } from "dotenv";

config({
  path: "../../.env",
});

export class CalcET0Handler {
  static name_queue = "cal-et0";
  calcEtoByDay;
  logsRepository;

  constructor(calcEtoByDay, logsRepository) {
    this.calcEtoByDay = calcEtoByDay;
    this.logsRepository = logsRepository;
    this.name_queue = CalcET0Handler.name_queue;
  }

  async handler(payload) {
    // const { id, data } = payload;

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

      console.log(current_date.getTime(), ":::", yesterday);

      //DD/MM/YYYY
      // const date = Intl.DateTimeFormat("pt-BR").format(yesterday);
      time = yesterday;
    }

    const dto = new CalcEtoDTO(time);

    try {
      await this.calcEtoByDay.execute(dto);
      await this.logsRepository.create(this.calcEtoByDay.getLogs());
    } catch (error) {
      console.error("[ERROR] - Falha ao executar worker da funceme.");
      console.error(error);

      await this.logsRepository.create({
        message: error.message,
        type: "error",
      });

      //Essencial para o PG-BOSS entender que ocorreu um erro
      throw error;
    }
  }
}
