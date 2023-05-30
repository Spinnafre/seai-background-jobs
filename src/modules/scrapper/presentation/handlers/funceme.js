import { FuncemeDataMinerDTO } from "../../core/dto.js";

import { FuncemeFactory } from "../../services/factories/funceme.js";

export async function FuncemeHandler(request) {
  const factory = new FuncemeFactory();
  console.log("REQUEST => ", request);
  const ftpClient = factory.buildConnection();
  const logs = factory.buildLogs();

  const ftpConnectionOrError = await ftpClient.connect();

  // Deu erro na conexão, então nem executa nada e sai do ciclo
  if (ftpConnectionOrError.connected === false) {
    await logs.create(ftpConnectionOrError.message);
    await ftpClient.close();
    throw new Error(ftpConnectionOrError.message);
  }

  const { stationService, pluviometerService } = factory.buildServices();

  const dto = new FuncemeDataMinerDTO(request.data.date);

  await stationService.execute(dto);
  await logs.create(stationService.getLogs());

  await pluviometerService.execute(dto);
  await logs.create(pluviometerService.getLogs());

  await ftpClient.close();
}
