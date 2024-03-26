import { FTPClientAdapter } from "../external/adapters/ftp/client/ftp-client-adapter.js";

import { FetchFuncemeEquipments } from "./fetch-funceme-measures.js";

import { MetereologicalEquipmentRepository } from "../../../../shared/database/repositories/Equipment.js";

export const makeFetchFuncemeEquipments = () => {
  const ftpClientAdapter = new FTPClientAdapter();

  const meteorologicalOrganRepositoryInMemory =
    new MetereologicalEquipmentRepository();

  return new FetchFuncemeEquipments(
    ftpClientAdapter,
    meteorologicalOrganRepositoryInMemory
  );
};
