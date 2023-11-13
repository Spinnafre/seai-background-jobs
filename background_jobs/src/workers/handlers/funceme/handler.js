import { FuncemeScrapperWorkerDTO } from "./dto.js";

export class FuncemeFTPWorker {
  static name_queue = "funceme-etl";
  static worker_name = "FuncemeETL";

  #fetchData = null;
  #calcEto = null;

  constructor(fetchData, calcEto) {
    this.#fetchData = fetchData;
    this.#calcEto = calcEto;
    this.name_queue = FuncemeFTPWorker.name_queue;
  }

  async handler(payload) {
    const dto = new FuncemeScrapperWorkerDTO(payload);

    const fetchedDataOrError = await this.#fetchData.handle(dto);

    if (fetchedDataOrError.isError()) {
      throw fetchedDataOrError.error();
    }

    const calcEtoOrError = await this.#calcEto.handle(dto);

    if (calcEtoOrError.isError()) {
      throw calcEtoOrError.error();
    }

    return;
  }
}
