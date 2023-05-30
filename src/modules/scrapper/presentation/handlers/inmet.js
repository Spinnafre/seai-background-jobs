import { InmetDataMinerDTO } from "../../../../core/dto.js";

import { InmetFactory } from "../../../../services/factories/inmet.js";

export async function InmetHandler(request) {
  const factory = new InmetFactory();
  console.log("REQUEST => ", request);
  factory.buildConnection();

  const logs = factory.buildLogs();

  const { service } = factory.buildServices();

  const dto = new InmetDataMinerDTO(request.data.date);

  await service.execute(dto);

  await logs.create(service.getLogs());
}
