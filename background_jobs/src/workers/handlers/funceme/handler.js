import { FetchEquipmentCommand } from "../../../modules/equipments/command.js";
export class FuncemeFTPWorker {
  static name_queue = "funceme-etl";
  static worker_name = "FuncemeETL";

  #fetchEquipments = null;

  constructor(fetchEquipments) {
    this.#fetchEquipments = fetchEquipments;
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
