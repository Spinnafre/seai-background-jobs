import { FTPClientAdapterMock } from "../../mock/funceme/ftp/connection.js";

import { MetereologicalEquipmentInMemory } from "../../database/inMemory/entities/metereologicalEquipment.js";
import { StationReadRepositoryInMemory } from "../../database/inMemory/entities/stationRead.js";

import { StationParser } from "../../../../src/jobs/scrapper/funceme/helpers/parser/station-parser.js";
import { StationMapper } from "../../../../src/jobs/scrapper/core/mappers/station-mapper.js";
import { FetchFuncemeData } from "../../../../src/jobs/scrapper/funceme/helpers/fetch-data/fetch-data.js";

import { ExtractStationsFromFunceme } from "../../../../src/jobs/scrapper/funceme/services/stations-measures/stations-measures-data-miner.js";

export default (metereologicalEquipmentDataAccess) => {
  const ftpAdapterMock = new FTPClientAdapterMock();

  const fetchFuncemeData = new FetchFuncemeData(
    ftpAdapterMock,
    new StationParser(),
    StationMapper,
    { folder: "pcds", fileName: "stn_data_2023.tar.gz" }
  );

  const metereologicalEquipmentDao =
    metereologicalEquipmentDataAccess || new MetereologicalEquipmentInMemory();
  const stationReadDao = new StationReadRepositoryInMemory();

  return new ExtractStationsFromFunceme(
    fetchFuncemeData,
    metereologicalEquipmentDao,
    stationReadDao
  );
};
