// npm run test:dev -i __tests__/units/services/funceme/station-measures-data-miner.spec.js
import {
  describe,
  expect,
  test,
  jest,
  afterEach,
  beforeEach,
} from "@jest/globals";

import { FTPClientAdapterMock } from "../../mock/funceme/ftp/connection.js";

import { StationMapper } from "../../../../src/jobs/scrapper/core/mappers/station-mapper.js";

import { StationReadRepositoryInMemory } from "../../database/inMemory/entities/stationRead.js";
// import { ReadTimeInMemory } from "../../database/inMemory/entities/readTime.js";
import { MetereologicalEquipmentInMemory } from "../../database/inMemory/entities/metereologicalEquipment.js";

import { FormatDate } from "../../../../src/jobs/scrapper/utils/date-formatter.js";
import { FetchFuncemeData } from "../../../../src/jobs/scrapper/funceme/helpers/fetch-data/fetch-data.js";
import { ExtractStationsFromFunceme } from "../../../../src/jobs/scrapper/funceme/services/stations-measures/stations-measures-data-miner.js";
import { StationParser } from "../../../../src/jobs/scrapper/funceme/helpers/parser/station-parser.js";
import { FuncemeDataMinerDTO } from "../../../../src/jobs/scrapper/funceme/command-handler/input-boundary.js";

let ftpAdapterMock = null;
let metereologicalEquipmentDao = null;
let stationReadDao = null;
let fetchFuncemeData = null;
let stationsMeasuresDataMinerService = null;

describe("# Station-Measures-Data-Miner", () => {
  beforeEach(() => {
    jest.useFakeTimers("modern");
    // jest.setSystemTime(new Date(2023, 3, 2));
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  beforeEach(() => {
    ftpAdapterMock = new FTPClientAdapterMock();

    const stationParser = new StationParser();

    fetchFuncemeData = new FetchFuncemeData(
      ftpAdapterMock,
      stationParser,
      StationMapper,
      { folder: "pcds", fileName: "stn_data_2023.tar.gz" }
    );

    metereologicalEquipmentDao = new MetereologicalEquipmentInMemory();
    stationReadDao = new StationReadRepositoryInMemory();

    stationsMeasuresDataMinerService = new ExtractStationsFromFunceme(
      fetchFuncemeData,
      metereologicalEquipmentDao,
      stationReadDao
    );
  });

  test("When has equipments but measures not exists, should be able to save measures data with null", async function () {
    jest.setSystemTime(new Date(2023, 5, 2));

    const stationCode = "A325";

    const equipments = [
      {
        IdEquipment: 1,
        IdEquipmentExternal: stationCode,
        Name: "Fortaleza",
        Altitude: 35,
        Organ_Id: 2,
        Organ: "FUNCEME",
        Type: "station",
        CreatedAt: new Date(),
        UpdatedAt: null,
      },
      {
        IdEquipment: 2,
        IdEquipmentExternal: "A205",
        Name: "Teste",
        Altitude: null,
        Organ_Id: 2,
        Organ: "FUNCEME",
        Type: "pluviometer",
        CreatedAt: new Date(),
        UpdatedAt: null,
      },
    ];

    const stationReadDaoSpy = jest.spyOn(stationReadDao, "create");

    await metereologicalEquipmentDao.createMetereologicalEquipment(
      equipments[0]
    );
    await metereologicalEquipmentDao.createMetereologicalEquipment(
      equipments[1]
    );

    const lastDate = new FuncemeDataMinerDTO(Date.now());

    await stationsMeasuresDataMinerService.execute(lastDate);

    const logs = stationsMeasuresDataMinerService.getLogs();

    expect(stationReadDaoSpy).toHaveBeenCalled();

    const station = await stationReadDao.list();

    station.forEach((pluviometer) => {
      expect(pluviometer).toMatchObject({
        TotalRadiation: null,
        RelativeHumidity: null,
        AtmosphericTemperature: null,
        WindVelocity: null,
        FK_Organ: 2,
        FK_Equipment: 1,
      });
    });

    expect(logs).toEqual([
      {
        type: "info",
        message: "Iniciando busca de dados de medições das estações da FUNCEME",
      },
      {
        type: "warning",
        message: `Não foi possível obter dados de medição estação ${stationCode}, salvando dados sem medições.`,
      },
      {
        type: "info",
        message: "Sucesso ao salvar leituras de estações da FUNCEME",
      },
    ]);
  });

  test("When has stations measures in funceme stations files, should create log with success and save stations with measures", async function () {
    jest.setSystemTime(new Date(2023, 3, 4));

    const equipmentCode = "A325";

    const equipments = [
      {
        IdEquipment: 1,
        IdEquipmentExternal: equipmentCode,
        Name: "Fortaleza",
        Altitude: 35,
        Organ_Id: 2,
        Organ: "FUNCEME",
        Type: "station",
        CreatedAt: new Date(),
        UpdatedAt: null,
      },
      {
        IdEquipment: 2,
        IdEquipmentExternal: "A205",
        Name: "Teste",
        Altitude: null,
        Organ_Id: 2,
        Organ: "FUNCEME",
        Type: "pluviometer",
        CreatedAt: new Date(),
        UpdatedAt: null,
      },
    ];

    const stationReadDaoSpy = jest.spyOn(stationReadDao, "create");

    await metereologicalEquipmentDao.createMetereologicalEquipment(
      equipments[0]
    );
    await metereologicalEquipmentDao.createMetereologicalEquipment(
      equipments[1]
    );

    const lastDate = new FuncemeDataMinerDTO(Date.now());

    await stationsMeasuresDataMinerService.execute(lastDate);

    const logs = stationsMeasuresDataMinerService.getLogs();

    expect(stationReadDaoSpy).toHaveBeenCalled();

    const station = await stationReadDao.list();

    const stationInDatabase = {
      TotalRadiation: null,
      RelativeHumidity: 82.42,
      AtmosphericTemperature: 24.59,
      WindVelocity: null,
      FK_Organ: 2,
      FK_Equipment: 1,
    };

    station.forEach((pluviometer) => {
      expect(pluviometer).toMatchObject(stationInDatabase);
    });

    expect(logs).toEqual([
      {
        type: "info",
        message: "Iniciando busca de dados de medições das estações da FUNCEME",
      },
      {
        type: "info",
        message: `Sucesso ao obter dados de medição estação ${equipmentCode}`,
      },
      {
        type: "info",
        message: "Sucesso ao salvar leituras de estações da FUNCEME",
      },
    ]);
  });
  test("When stations codes not exists in funceme stations files, should create log with error and save stations without measures", async function () {
    jest.setSystemTime(new Date(2023, 7, 2));
    const equipments = [
      {
        IdEquipment: 1,
        IdEquipmentExternal: "AA@!@#925",
        Name: "Fortaleza",
        Altitude: 35,
        Organ_Id: 2,
        Organ: "FUNCEME",
        Type: "station",
        CreatedAt: new Date(),
        UpdatedAt: null,
      },
    ];

    const stationReadDaoSpy = jest.spyOn(stationReadDao, "create");

    await metereologicalEquipmentDao.createMetereologicalEquipment(
      equipments[0]
    );

    const lastDate = new FuncemeDataMinerDTO(Date.now());

    await stationsMeasuresDataMinerService.execute(lastDate);

    expect(stationReadDaoSpy).toHaveBeenCalled();

    const station = await stationReadDao.list();

    const stationInDatabase = {
      TotalRadiation: null,
      RelativeHumidity: null,
      AtmosphericTemperature: null,
      WindVelocity: null,
      FK_Organ: 2,
      FK_Equipment: 1,
    };

    station.forEach((pluviometer) => {
      expect(pluviometer).toMatchObject(stationInDatabase);
    });

    expect(stationsMeasuresDataMinerService.getLogs()).toEqual([
      {
        type: "info",
        message: "Iniciando busca de dados de medições das estações da FUNCEME",
      },
      {
        type: "warning",
        message:
          "Não foi possível obter dados de medição estação AA@!@#925, salvando dados sem medições.",
      },
      {
        type: "info",
        message: "Sucesso ao salvar leituras de estações da FUNCEME",
      },
    ]);
  });
});
