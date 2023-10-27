// import { config } from "dotenv";

import { CalcEtoWorkerDTO } from "./dto.js";

// config({
//   path: "../../.env",
// });

export class CalcET0Worker {
  static name_queue = "cal-et0";
  static worker_name = "CalcET0Worker";
  #controller = null;

  constructor(controller) {
    this.name_queue = CalcET0Worker.name_queue;
    this.#controller = controller;
  }

  async handler(payload) {
    const dto = new CalcEtoWorkerDTO(payload);

    const resultOrError = await this.#controller.handle(dto);

    if (resultOrError.isError()) {
      throw resultOrError.error();
    }

    return;
  }
}
