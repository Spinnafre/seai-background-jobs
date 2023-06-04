import { InmetDataMinerDTO } from "../protocols/dto.js";

import { InmetFactory } from "../factories/inmet.js";

export class InmetScrapper {
  static name_queue = "inmet-scrapper";

  async handler(payload) {
    const { id, data } = payload;

    const time = data.date;

    const factory = new InmetFactory();
    console.log("REQUEST => ", date);
    factory.buildConnection();

    const logs = factory.buildLogs();

    const { service } = factory.buildServices();

    const dto = new InmetDataMinerDTO(time);

    await service.execute(dto);

    await logs.create(service.getLogs());
  }
}
