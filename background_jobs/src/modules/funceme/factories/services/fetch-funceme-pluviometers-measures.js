import { FUNCEME_FTP_DIRECTORIES, EQUIPMENT_TYPE } from "../../config/index.js";

import {
  MetereologicalEquipmentRepository,
  PluviometerReadRepository,
} from "../../../../shared/database/repositories/index.js";
import { PluviometerMapper } from "../../core/mappers/index.js";

import { PluviometerParser } from "../../core/parser/index.js";
import { FetchFuncemeMeasures } from "../../services/fetch-funceme-measures.js";
import { makeFetchFTPData } from "./fetch-ftp-data.js";

export const makeFetchFuncemePluviometerMeasures = (FtpClientAdapter) => {
  return new FetchFuncemeMeasures(
    makeFetchFTPData(FtpClientAdapter),
    new MetereologicalEquipmentRepository(),
    new PluviometerReadRepository(),
    new PluviometerParser(),
    PluviometerMapper,
    FUNCEME_FTP_DIRECTORIES.directories.pluviometer,
    EQUIPMENT_TYPE.PLUVIOMETERS
  );
};
