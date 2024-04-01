import { FetchEquipmentCommand } from "../../../modules/equipments/command.js";
export class FuncemeFuncemeEquipmentsWorker {
  static name_queue = "funceme-equipments";
  static worker_name = "FetchFuncemeEquipments";

  #fetchEquipments = null;

  constructor(fetchEquipments) {
    this.#fetchEquipments = fetchEquipments;
    this.name_queue = FuncemeFuncemeEquipmentsWorker.name_queue;
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

export class FetchFuncemeMeasurementsWorker {
  static name_queue = "funceme-measurements";
  static worker_name = "FetchFuncemeMeasurements";

  #fetchMeasurements = null;

  constructor(fetchMeasurements) {
    this.#fetchMeasurements = fetchMeasurements;
    this.name_queue = FetchFuncemeMeasurementsWorker.name_queue;
  }

  async handler(payload) {
    const fetchedDataOrError = await this.#fetchMeasurements.execute(
      new FetchEquipmentCommand()
    );

    if (fetchedDataOrError.isError()) {
      throw fetchedDataOrError.error();
    }

    return;
  }
}
