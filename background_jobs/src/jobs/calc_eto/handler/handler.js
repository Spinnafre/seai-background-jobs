import { CalcEtoDTO } from "./input-boundary";

export class CalcET0 {
  static name_queue = "cal-et0";
  calcEtoByDay;

  constructor(calcEtoByDay) {
    this.calcEtoByDay = calcEtoByDay;
    this.name_queue = CalcET0.name_queue;
  }

  async handler(payload) {
    const { id, data } = payload;

    const time = data.date;

    console.log("Date ::: ", time);

    const dto = new CalcEtoDTO(time);

    try {
      await this.calcEtoByDay(dto);
    } catch (error) {
      console.error("[ERROR] - Falha ao executar worker da funceme.");
      console.error(error);

      // await this.logs.create({
      //   message: error.message,
      //   type: "error",
      // });

      //Essencial para o PG-BOSS entender que ocorreu um erro
      throw error;
    }
  }
}
