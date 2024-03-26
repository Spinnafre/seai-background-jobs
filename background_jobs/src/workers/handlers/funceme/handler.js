import { FetchEquipmentCommand } from "../../../modules/equipments/command.js";
export class FuncemeFTPWorker {
  static name_queue = "funceme-etl";
  static worker_name = "FuncemeETL";

  #fetchEquipments = null;
  #calcEto = null;

  constructor(fetchEquipments, calcEto) {
    this.#fetchEquipments = fetchEquipments;
    this.#calcEto = calcEto;
    this.name_queue = FuncemeFTPWorker.name_queue;
  }

  async handler(payload) {
    const dto = new FetchEquipmentCommand();

    const fetchedDataOrError = await this.#fetchEquipments.execute(dto);

    if (fetchedDataOrError.isError()) {
      throw fetchedDataOrError.error();
    }

    return;
  }
}
