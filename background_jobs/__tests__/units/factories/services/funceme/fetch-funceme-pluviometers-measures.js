import { EQUIPMENT_TYPE } from "../../../../../src/modules/funceme/config/equipments-types.js";
import { FUNCEME_FTP_DIRECTORIES } from "../../../../../src/modules/funceme/config/funceme-ftp-directories.js";
import { PluviometerMapper } from "../../../../../src/modules/funceme/core/mappers/pluviometer-mapper.js";
import { PluviometerParser } from "../../../../../src/modules/funceme/core/parser/pluviometer-parser.js";
import { makeFetchFTPData } from "../../../../../src/modules/funceme/factories/services/fetch-ftp-data.js";
import { FetchFuncemeMeasures } from "../../../../../src/modules/funceme/services/index.js";
import { MetereologicalEquipmentRepositoryInMemory,PluviometerReadRepositoryInMemory } from "../../../mock/repositories/inMemory/entities/index.js";

export const makeFetchFuncemePluviometerMeasures = (FtpClientAdapter) => {
  return new FetchFuncemeMeasures(
    makeFetchFTPData(FtpClientAdapter),
    new MetereologicalEquipmentRepositoryInMemory(),
    new PluviometerReadRepositoryInMemory(),
    new PluviometerParser(),
    PluviometerMapper,
    FUNCEME_FTP_DIRECTORIES.directories.pluviometer,
    EQUIPMENT_TYPE.PLUVIOMETERS
  );
};
