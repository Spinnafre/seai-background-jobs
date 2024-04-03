import { EquipmentCommand } from "../../../modules/equipments/services/commands/command.js";

import { makeFetchEquipmentsMeasurements } from "../../../modules/equipments/services/measurements/factory.js";

export class FetchFuncemeMeasurementsWorker {
  static name_queue = "funceme-measurements";
  static worker_name = "FetchFuncemeMeasurements";

  // constructor(fetchMeasurements) {
  //   this.#fetchMeasurements = fetchMeasurements;
  //   this.name_queue = FetchFuncemeMeasurementsWorker.name_queue;
  // }

  static async handler(payload) {
    const service = makeFetchEquipmentsMeasurements();

    const fetchedDataOrError = await service.execute(new EquipmentCommand());

    if (fetchedDataOrError.isError()) {
      throw fetchedDataOrError.error();
    }

    return;
  }
}
