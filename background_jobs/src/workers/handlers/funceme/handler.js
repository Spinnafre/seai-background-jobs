import { FuncemeScrapperWorkerDTO } from "./dto.js";

export class FuncemeFTPDataMinerWorker {
  static name_queue = "funceme-scrapper";
  static worker_name = "FuncemeFTPDataMinerWorker";
  #controller = null;

  constructor(controller) {
    this.#controller = controller;
    this.name_queue = FuncemeFTPDataMinerWorker.name_queue;
  }

  async handler(payload) {
    const dto = new FuncemeScrapperWorkerDTO(payload);

    const resultOrError = await this.#controller.handle(dto);

    if (resultOrError.isError()) {
      throw resultOrError.error();
    }
    return;
  }
}
