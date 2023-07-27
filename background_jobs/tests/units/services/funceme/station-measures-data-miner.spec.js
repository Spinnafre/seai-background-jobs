// npm run test:dev -i tests/services/funceme/station-measures-data-miner.spec.js
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

import { StationRead } from "../../database/inMemory/entities/stationRead.js";
import { ReadTimeInMemory } from "../../database/inMemory/entities/readTime.js";
import { MetereologicalEquipmentInMemory } from "../../database/inMemory/entities/metereologicalEquipment.js";

import { FormatDate } from "../../../../src/jobs/scrapper/utils/date-formatter.js";
import { FetchFuncemeData } from "../../../../src/jobs/scrapper/funceme/helpers/fetch-data/fetch-data.js";
import { ExtractStationsFromFunceme } from "../../../../src/jobs/scrapper/funceme/services/stations-measures/stations-measures-data-miner.js";
import { StationParser } from "../../../../src/jobs/scrapper/funceme/helpers/parser/station-parser.js";
import { FuncemeDataMinerDTO } from "../../../../src/jobs/scrapper/funceme/command-handler/input-boundary.js";

let ftpAdapterMock = null;
let metereologicalEquipmentDao = null;
let stationReadDao = null;
let readTimeDao = null;
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
    stationReadDao = new StationRead();
    readTimeDao = new ReadTimeInMemory();

    stationsMeasuresDataMinerService = new ExtractStationsFromFunceme(
      fetchFuncemeData,
      metereologicalEquipmentDao,
      stationReadDao
    );
  });

  test("When has equipments but measures not exists, should be able to save measures data with null", async function () {
    jest.setSystemTime(new Date(2023, 3, 2));
    const equipments = [
      {
        IdEquipment: 1,
        IdEquipmentExternal: "A325",
        Name: "Fortaleza",
        Altitude: 35,
        FK_Organ: 2,
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
        FK_Organ: 2,
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

    const yesterdayDate = FormatDate.getYesterdayTimestamp();

    // Irá ser responsabilidade de um serviço principal
    const lastDate = new FuncemeDataMinerDTO(
      FormatDate.timestampToDate(yesterdayDate, {
        separator: "-",
      })
    );

    await stationsMeasuresDataMinerService.execute(lastDate);

    expect(stationReadDaoSpy).toHaveBeenCalled();

    const station = await stationReadDao.list();

    const stationInDatabase = {
      TotalRadiation: null,
      RelativeHumidity: 84.54,
      AtmosphericTemperature: 24.83,
      WindVelocity: null,
      //   FK_Time: lastDate.IdTime,
      FK_Organ: 2,
      FK_Equipment: 1,
    };

    station.forEach((pluviometer) => {
      expect(pluviometer).toMatchObject(stationInDatabase);
    });
  });

  test("When has stations measures in funceme stations files, should create log with success and save stations with measures", async function () {
    jest.setSystemTime(new Date(2023, 7, 2));
    const equipments = [
      {
        IdEquipment: 1,
        IdEquipmentExternal: "A325",
        Name: "Fortaleza",
        Altitude: 35,
        FK_Organ: 2,
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
        FK_Organ: 2,
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

    const yesterdayDate = FormatDate.getYesterdayTimestamp();

    // Irá ser responsabilidade de um serviço principal
    const lastDate = new FuncemeDataMinerDTO(
      FormatDate.timestampToDate(yesterdayDate, {
        separator: "-",
      })
    );

    await stationsMeasuresDataMinerService.execute(lastDate);

    expect(stationReadDaoSpy).toHaveBeenCalled();

    const station = await stationReadDao.list();

    const stationInDatabase = {
      TotalRadiation: null,
      RelativeHumidity: null,
      AtmosphericTemperature: null,
      WindVelocity: null,
      //   FK_Time: lastDate.IdTime,
      FK_Organ: 2,
      FK_Equipment: 1,
    };

    station.forEach((pluviometer) => {
      expect(pluviometer).toMatchObject(stationInDatabase);
    });
  });
  test("When stations codes not exists in funceme stations files, should create log with error and save stations without measures", async function () {
    jest.setSystemTime(new Date(2023, 7, 2));
    const equipments = [
      {
        IdEquipment: 1,
        IdEquipmentExternal: "A925",
        Name: "Fortaleza",
        Altitude: 35,
        FK_Organ: 2,
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

    const yesterdayDate = FormatDate.getYesterdayTimestamp();

    // Irá ser responsabilidade de um serviço principal
    const lastDate = new FuncemeDataMinerDTO(
      FormatDate.timestampToDate(yesterdayDate, {
        separator: "-",
      })
    );

    await stationsMeasuresDataMinerService.execute(lastDate);

    expect(stationReadDaoSpy).toHaveBeenCalled();

    const station = await stationReadDao.list();

    const stationInDatabase = {
      TotalRadiation: null,
      RelativeHumidity: null,
      AtmosphericTemperature: null,
      WindVelocity: null,
      //   FK_Time: lastDate.IdTime,
      FK_Organ: 2,
      FK_Equipment: 1,
    };

    station.forEach((pluviometer) => {
      expect(pluviometer).toMatchObject(stationInDatabase);
    });

    expect(
      stationsMeasuresDataMinerService
        .getLogs()
        .find(
          (log) =>
            log.message ===
            "Não foi possível obter dados de medição estação Fortaleza, salvando dados sem medições."
        )
    ).toEqual({
      type: "warning",
      message:
        "Não foi possível obter dados de medição estação Fortaleza, salvando dados sem medições.",
    });
  });
});
