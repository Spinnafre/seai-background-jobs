// npm run test:dev -i tests/services/funceme/pluviometer-measures-data-miner.spec.js
import {
  describe,
  expect,
  test,
  jest,
  afterEach,
  beforeEach,
} from "@jest/globals";

import { FTPClientAdapterMock } from "../../mock/funceme/ftp/connection.js";

import { PluviometerMapper } from "../../../src/jobs/scrapper/core/mappers/pluviometer-mapper.js";

import { PluviometerRead } from "../../database/inMemory/entities/pluviometerRead.js";
import { ReadTimeInMemory } from "../../database/inMemory/entities/readTime.js";
import { MetereologicalEquipmentInMemory } from "../../database/inMemory/entities/metereologicalEquipment.js";

import { FormatDate } from "../../../src/jobs/scrapper/utils/date-formatter.js";
import { FetchFuncemeData } from "../../../src/jobs/scrapper/funceme/helpers/fetch-data/fetch-data.js";
import { ExtractPluviometersFromFunceme } from "../../../src/jobs/scrapper/funceme/services/pluviometers-measures/pluviometers-measures-data-miner.js";
import { PluviometerParser } from "../../../src/jobs/scrapper/funceme/helpers/parser/pluviometer-parser.js";
import { FuncemeDataMinerDTO } from "../../../src/jobs/scrapper/funceme/command-handler/input-boundary.js";

let ftpAdapterMock = null;
let metereologicalEquipmentDao = null;
let pluviometerReadDao = null;
let readTimeDao = null;
let fetchFuncemeData = null;
let service = null;

describe("# Pluviometer-Measures-Data-Miner", () => {
  beforeEach(() => {
    jest.useFakeTimers("modern");
    // jest.setSystemTime(new Date(2023, 3, 2));
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  beforeEach(() => {
    ftpAdapterMock = new FTPClientAdapterMock();

    fetchFuncemeData = new FetchFuncemeData(
      ftpAdapterMock,
      new PluviometerParser(),
      PluviometerMapper,
      { folder: "pluviometros", fileName: "prec_data_2023.tar.gz" }
    );

    metereologicalEquipmentDao = new MetereologicalEquipmentInMemory();
    pluviometerReadDao = new PluviometerRead();
    readTimeDao = new ReadTimeInMemory();

    service = new ExtractPluviometersFromFunceme(
      fetchFuncemeData,
      metereologicalEquipmentDao,
      pluviometerReadDao
    );
  });

  test("When has equipments but measures not exists, should be able to save measures data with null", async function () {
    jest.setSystemTime(new Date(2023, 2, 2));

    const equipments = [
      {
        IdEquipment: 2,
        IdEquipmentExternal: "23984",
        Name: "Teste",
        Altitude: null,
        FK_Organ: 2,
        Organ: "FUNCEME",
        Type: "pluviometer",
        CreatedAt: new Date(),
        UpdatedAt: null,
      },
    ];

    const pluviometerReadDaoSpy = jest.spyOn(pluviometerReadDao, "create");

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

    await service.execute(lastDate);

    expect(pluviometerReadDaoSpy).toHaveBeenCalled();

    const pluviometers = await pluviometerReadDao.list();

    const pluviometerInDatabase = {
      Value: null,
      //   FK_Time: lastDate.IdTime,
      FK_Organ: 2,
      FK_Equipment: 2,
    };

    pluviometers.forEach((pluviometer) => {
      expect(pluviometer).toMatchObject(pluviometerInDatabase);
    });
  });

  test("When has pluviometer measures in funceme files, should create log with success and save data with measures", async function () {
    // jest.setSystemTime(new Date(2023, 3, 2));

    const equipments = [
      {
        IdEquipment: 2,
        IdEquipmentExternal: "23984",
        Name: "Teste",
        Altitude: null,
        FK_Organ: 2,
        Organ: "FUNCEME",
        Type: "pluviometer",
        CreatedAt: new Date(),
        UpdatedAt: null,
      },
    ];

    const pluviometerReadDaoSpy = jest.spyOn(pluviometerReadDao, "create");

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

    await service.execute(lastDate);

    expect(pluviometerReadDaoSpy).toHaveBeenCalled();

    const pluviometers = await pluviometerReadDao.list();

    const pluviometerInDatabase = {
      Value: null,
      //   FK_Time: lastDate.IdTime,
      FK_Organ: 2,
      FK_Equipment: 2,
    };

    pluviometers.forEach((pluviometer) => {
      expect(pluviometer).toMatchObject(pluviometerInDatabase);
    });
  });

  test("When pluviometers codes not exists in funceme stations files, should create log with error and save data without measures", async function () {
    jest.setSystemTime(new Date(2023, 3, 2));

    const equipments = [
      {
        IdEquipment: 2,
        IdEquipmentExternal: "@3123123s",
        Name: "Teste",
        Altitude: null,
        FK_Organ: 2,
        Organ: "FUNCEME",
        Type: "pluviometer",
        CreatedAt: new Date(),
        UpdatedAt: null,
      },
    ];

    const pluviometerReadDaoSpy = jest.spyOn(pluviometerReadDao, "create");

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

    await service.execute(lastDate);

    expect(pluviometerReadDaoSpy).toHaveBeenCalled();

    const pluviometers = await pluviometerReadDao.list();

    const pluviometerInDatabase = {
      Value: null,
      //   FK_Time: lastDate.IdTime,
      FK_Organ: 2,
      FK_Equipment: 2,
    };

    pluviometers.forEach((pluviometer) => {
      expect(pluviometer).toMatchObject(pluviometerInDatabase);
    });

    const logs = service.getLogs();

    expect(
      logs.find(
        (log) =>
          log.message ===
          "Não foi possível obter dados de medição do pluviômetro Teste, salvando dados sem medições."
      )
    ).toEqual({
      type: "warning",
      message:
        "Não foi possível obter dados de medição do pluviômetro Teste, salvando dados sem medições.",
    });
  });
});
