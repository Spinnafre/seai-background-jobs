// npm run test:dev -i tests/services/funcemeDataMiner.spec.js
import {
  describe,
  expect,
  test,
  jest,
  afterEach,
  beforeEach,
  beforeAll,
  afterAll,
} from "@jest/globals";

import { FTPClientAdapterMock } from "../mock/funceme/ftp/connection.js";
import { FuncemeGateway } from "../../src/infra/ftp/gateway/funceme.js";
import { FuncemeDataMiner } from "../../src/commands/funcemeDataMiner.js";

import { StationRead } from "../../src/infra/database/inMemoryDataAccess/stationRead.js";

import { PluviometerRead } from "../../src/infra/database/inMemoryDataAccess/pluviometerRead.js";
import { ReadTimeInMemory } from "../../src/infra/database/inMemoryDataAccess/readTime.js";

import { MetereologicalEquipmentInMemory } from "../../src/infra/database/inMemoryDataAccess/metereologicalEquipment.js";

import {
  formatDateToForwardSlash,
  getYesterdayTimestamp,
} from "../../src/utils/date.js";

let funcemeDataMiner = null;

let ftp = null;
let gateway = null;

let metereologicalEquipmentDao = null;
let stationReadDao = null;
let pluviometerReadDao = null;
let readTimeDao = null;

describe("#FuncemeDataMiner", () => {
  beforeAll(() => {
    jest.useFakeTimers("modern");
    jest.setSystemTime(new Date(2023, 4, 2));
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  beforeEach(() => {
    ftp = new FTPClientAdapterMock();
    gateway = new FuncemeGateway(ftp);

    metereologicalEquipmentDao = new MetereologicalEquipmentInMemory();
    stationReadDao = new StationRead();
    pluviometerReadDao = new PluviometerRead();

    funcemeDataMiner = new FuncemeDataMiner(
      gateway,
      metereologicalEquipmentDao,
      stationReadDao,
      pluviometerReadDao
    );

    readTimeDao = new ReadTimeInMemory();
  });

  test("When has equipments but measures not exists, should be able to save measures data with null", async function () {
    const equipments = [
      {
        IdEquipment: 1,
        IdEquipmentExternal: "TESTE",
        Name: "Fortaleza",
        Altitude: 35,
        Organ: {
          FK_Organ: 2,
          Name: "FUNCEME",
        },
        Type: {
          FK_Type: 1,
          Name: "station",
        },
        CreatedAt: new Date(),
        UpdatedAt: null,
      },
      {
        IdEquipment: 2,
        IdEquipmentExternal: "TESTE",
        Name: "Teste",
        Altitude: null,
        Organ: {
          FK_Organ: 2,
          Name: "FUNCEME",
        },
        Type: {
          FK_Type: 2,
          Name: "pluviometer",
        },
        CreatedAt: new Date(),
        UpdatedAt: null,
      },
    ];

    const stationReadDaoSpy = jest.spyOn(stationReadDao, "create");
    const pluviometerReadDaoSpy = jest.spyOn(pluviometerReadDao, "create");

    await metereologicalEquipmentDao.createMetereologicalEquipment(equipments);

    const yesterdayDate = getYesterdayTimestamp();

    // Irá ser responsabilidade de um serviço principal
    const lastDate = {
      IdTime: 1,
      Time: yesterdayDate,
    };

    await funcemeDataMiner.execute(lastDate);

    expect(stationReadDaoSpy).toHaveBeenCalled();
    expect(pluviometerReadDaoSpy).toHaveBeenCalled();

    const station = await stationReadDao.list();

    const pluviometer = await pluviometerReadDao.list();

    const pluviometerInDatabase = {
      Value: null,
      FK_Time: lastDate.IdTime,
      FK_Organ: 2,
      FK_Equipment: 2,
    };

    const stationInDatabase = {
      TotalRadiation: null,
      RelativeHumidity: null,
      AtmosphericTemperature: null,
      WindVelocity: null,
      FK_Time: lastDate.IdTime,
      FK_Organ: 2,
      FK_Equipment: 1,
    };

    station.forEach((pluviometer) => {
      expect(pluviometer).toMatchObject(stationInDatabase);
    });
    pluviometer.forEach((pluviometer) => {
      expect(pluviometer).toMatchObject(pluviometerInDatabase);
    });
  });

  test.todo(
    "When has stations measures in funceme stations files, should create log with success and save stations with measures"
  );
  test.todo(
    "When has pluviometers measures in funceme pluviometers files, should create log with success and save stations with measures"
  );
  test.todo(
    "When stations codes not exists in funceme stations files, should create log with error and save stations without measures"
  );
  test.todo(
    "When pluviometers codes not exists in funceme pluviometer files, should create log with error and save stations without measures"
  );
});
