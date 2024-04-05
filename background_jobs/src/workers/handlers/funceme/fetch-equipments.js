import { EquipmentCommand } from "../../../modules/equipments/services/commands/command.js";

import { makeFetchEquipments } from "../../../modules/equipments/services/equipments/factory.js";

export class FetchFuncemeEquipmentsWorker {
  static name_queue = "funceme-equipments";
  static worker_name = "FuncemeEquipmentsWorker";

  // constructor(fetchEquipments) {
  //   this.#fetchEquipments = fetchEquipments;
  //   this.name_queue = FuncemeFuncemeEquipmentsWorker.name_queue;
  // }

  static async handler(payload) {
    const dto = new EquipmentCommand();

    const service = makeFetchEquipments();

    const fetchedDataOrError = await service.execute(dto);

    if (fetchedDataOrError.isError()) {
      throw fetchedDataOrError.error();
    }

    return;
  }
}
