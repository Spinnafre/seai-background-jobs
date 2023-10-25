import { EQUIPMENT_TYPE } from "../../../../../src/modules/funceme/config/equipments-types.js";
import { FUNCEME_FTP_DIRECTORIES } from "../../../../../src/modules/funceme/config/funceme-ftp-directories.js";
import { StationMapper } from "../../../../../src/modules/funceme/core/mappers/index.js";
import { StationParser } from "../../../../../src/modules/funceme/core/parser/index.js";
import { makeFetchFTPData } from "../../../../../src/modules/funceme/factories/services/fetch-ftp-data.js";
import { FetchFuncemeMeasures } from "../../../../../src/modules/funceme/services/index.js";
import { MetereologicalEquipmentRepositoryInMemory,StationReadRepositoryInMemory } from "../../../mock/repositories/inMemory/entities/index.js";

export const makeFetchFuncemePluviometerMeasures = (FtpClientAdapter) => {
  return new FetchFuncemeMeasures(
    makeFetchFTPData(FtpClientAdapter),
    new MetereologicalEquipmentRepositoryInMemory(),
    new StationReadRepositoryInMemory(),
    new StationParser(),
    StationMapper,
    FUNCEME_FTP_DIRECTORIES.directories.station,
    EQUIPMENT_TYPE.STATIONS
  );
};
