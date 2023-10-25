import { EQUIPMENT_TYPE } from "../../../../../src/modules/funceme/config/equipments-types.js";
import { FUNCEME_FTP_DIRECTORIES } from "../../../../../src/modules/funceme/config/funceme-ftp-directories.js";

import { FetchFuncemeMeasures } from "../../../../../src/modules/funceme/services/fetch-funceme-measures.js";
import {PluviometerMapper,StationMapper} from '../../../../../src/modules/funceme/core/mappers/index.js'
import {PluviometerParser,StationParser} from '../../../../../src/modules/funceme/core/parser/index.js'
export class FuncemeServicesBuilder{
  FetchFTPData;
  MetereologicalEquipmentRepositoryInMemory;
  PluviometerReadRepositoryInMemory;
  StationReadRepositoryInMemory;
  PluviometerParser;
  PluviometerMapper;
  StationParser
  StationMapper

  constructor({FetchFTPData,MetereologicalEquipmentRepositoryInMemory,PluviometerReadRepositoryInMemory}){
    this.FetchFTPData = FetchFTPData
    this.MetereologicalEquipmentRepositoryInMemory = MetereologicalEquipmentRepositoryInMemory
    this.PluviometerReadRepositoryInMemory = PluviometerReadRepositoryInMemory
    this.PluviometerParser = PluviometerParser
    this.PluviometerMapper = PluviometerMapper
    this.StationParser = StationParser
    this.StationMapper = StationMapper
  }

  makeFetchFuncemePluviometerMeasures (){
    return new FetchFuncemeMeasures(
      this.FetchFTPData,
      this.MetereologicalEquipmentRepositoryInMemory,
      this.PluviometerReadRepositoryInMemory,
      this.PluviometerParser,
      this.PluviometerMapper,
      FUNCEME_FTP_DIRECTORIES.directories.pluviometer,
      EQUIPMENT_TYPE.PLUVIOMETERS
    );
  };


  makeFetchFuncemeStationsMeasures(){
    return new FetchFuncemeMeasures(
      this.FetchFTPData,
      this.MetereologicalEquipmentRepositoryInMemory,
      this.StationReadRepositoryInMemory,
      this.StationParser,
      this.StationMapper,
      FUNCEME_FTP_DIRECTORIES.directories.station,
      EQUIPMENT_TYPE.STATIONS
    );
  }
}