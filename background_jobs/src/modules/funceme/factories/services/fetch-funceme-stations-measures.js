import { FUNCEME_FTP_DIRECTORIES, EQUIPMENT_TYPE } from "../../config/index.js";

import {
  MetereologicalEquipmentRepository,
  StationReadRepository,
} from "../../../../shared/database/repositories/index.js";
import { StationMapper } from "../../core/mappers/index.js";

import { StationParser } from "../../core/parser/index.js";
import { FetchFuncemeMeasures } from "../../services/fetch-funceme-measures.js";
import { makeFetchFTPData } from "./fetch-ftp-data.js";

export const makeFetchFuncemeStationsMeasures = (FtpClientAdapter) => {
  return new FetchFuncemeMeasures(
    makeFetchFTPData(FtpClientAdapter),
    new MetereologicalEquipmentRepository(),
    new StationReadRepository(),
    new StationParser(),
    StationMapper,
    FUNCEME_FTP_DIRECTORIES.directories.station,
    EQUIPMENT_TYPE.STATIONS
  );
};
