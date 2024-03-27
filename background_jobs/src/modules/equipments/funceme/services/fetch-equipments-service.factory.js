import { FTPClientAdapter } from "../external/adapters/ftp/client/ftp-client-adapter.js";

import { FetchFuncemeEquipments } from "./fetch-funceme-measures.js";

import { MetereologicalEquipmentRepository } from "../../../../shared/database/repositories/Equipment.js";
import { CalcETOService } from "../../../calc-eto/services/calc-eto-by-date-v2.js";

export const makeFetchFuncemeEquipments = () => {
  return new FetchFuncemeEquipments(
    new FTPClientAdapter(),
    new MetereologicalEquipmentRepository(),
    new CalcETOService()
  );
};
