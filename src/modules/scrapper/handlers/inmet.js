import { InmetDataMinerDTO } from "../core/dto.js";

import { InmetFactory } from "../inmet/factories/inmet.js";

export class InmetDataMinerHandler {
  #factory;
  constructor() {
    this.#factory = new InmetFactory();
  }

  async run(timestamp) {
    this.#factory.buildConnection();

    const logs = this.#factory.buildLogs();

    const { service } = this.#factory.buildServices();

    const dto = new InmetDataMinerDTO(timestamp);

    await service.execute(dto);
    
    await logs.create(service.getLogs());
  }
}
