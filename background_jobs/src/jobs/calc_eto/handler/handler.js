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

    const time = payload?.data?.date || new Date();

    console.log("Date ::: ", time);

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
