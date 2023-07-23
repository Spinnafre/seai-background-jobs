import { FTPClientAdapterMock } from "../../mock/funceme/ftp/connection.js";

import { PluviometerMapper } from "../../../src/jobs/scrapper/core/mappers/pluviometer-mapper.js";

import { PluviometerRead } from "../../database/inMemory/entities/pluviometerRead.js";
import { ReadTimeInMemory } from "../../database/inMemory/entities/readTime.js";
import { MetereologicalEquipmentInMemory } from "../../database/inMemory/entities/metereologicalEquipment.js";

import { FetchFuncemeData } from "../../../src/jobs/scrapper/funceme/helpers/fetch-data/fetch-data.js";
import { ExtractPluviometersFromFunceme } from "../../../src/jobs/scrapper/funceme/services/pluviometers-measures/pluviometers-measures-data-miner.js";
import { PluviometerParser } from "../../../src/jobs/scrapper/funceme/helpers/parser/pluviometer-parser.js";

export default (metereologicalEquipmentDataAccess) => {
  const ftpAdapterMock = new FTPClientAdapterMock();

  const fetchFuncemeData = new FetchFuncemeData(
    ftpAdapterMock,
    new PluviometerParser(),
    PluviometerMapper,
    { folder: "pluviometros", fileName: "prec_data_2023.tar.gz" }
  );

  const metereologicalEquipmentDao =
    metereologicalEquipmentDataAccess || new MetereologicalEquipmentInMemory();
  const pluviometerReadDao = new PluviometerRead();
  const readTimeDao = new ReadTimeInMemory();

  return new ExtractPluviometersFromFunceme(
    fetchFuncemeData,
    metereologicalEquipmentDao,
    pluviometerReadDao
  );
};
