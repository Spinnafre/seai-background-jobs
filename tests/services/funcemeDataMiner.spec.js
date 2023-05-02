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
import { FuncemeDataMiner } from "../../src/services/funcemeDataMiner.js";

import { StationRead } from "../../src/infra/database/inMemoryDataAccess/stationRead.js";

import { PluviometerRead } from "../../src/infra/database/inMemoryDataAccess/pluviometerRead.js";
import { ReadTimeInMemory } from "../../src/infra/database/inMemoryDataAccess/readTime.js";

import { MetereologicalEquipmentInMemory } from "../../src/infra/database/inMemoryDataAccess/metereologicalEquipment.js";

let funcemeDataMiner = null;

let ftp = null;
let gateway = null;

let metereologicalEquipmentDao = null;
let stationReadDao = null;
let pluviometerReadDao = null;
let readTimeDao = null;

// npm run test:dev -i tests/services/funcemeDataMiner.spec.js

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
    readTimeDao = new PluviometerRead();
    readTimeDao = new ReadTimeInMemory();

    funcemeDataMiner = new FuncemeDataMiner(
      gateway,
      metereologicalEquipmentDao,
      stationReadDao,
      pluviometerReadDao,
      readTimeDao
    );
  });

  test("Should be able to get equipments by types", async function () {
    const equipments = [
      {
        IdEquipment: 1,
        IdEquipmentExternal: "A305",
        Name: "Fortaleza-CE",
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
        IdEquipmentExternal: "23984",
        Name: "Teste",
        Altitude: null,
        Organ: {
          FK_Organ: 2,
          Name: "FUNCEME",
        },
        Type: {
          FK_Type: 2,
          Name: "station",
        },
        CreatedAt: new Date(),
        UpdatedAt: null,
      },
    ];

    const equipmentType = [
      {
        IdType: 1,
        Name: "station",
      },
      {
        IdType: 2,
        Name: "pluviometer",
      },
    ];

    const organs = [
      {
        IdOrgan: 1,
        Name: "INMET",
      },
      {
        IdOrgan: 2,
        Name: "FUNCEME",
      },
    ];

    const times = [
      {
        IdTime: 1,
        Time: "02/04/2023",
      },
    ];

    const stationReadDaoSpy = jest.spyOn(stationReadDao, "create");
    const pluviometerReadDaoSpy = jest.spyOn(pluviometerReadDao, "create");

    await metereologicalEquipmentDao.createMetereologicalEquipment(equipments);

    await funcemeDataMiner.execute();

    console.log("REPOSITÓRIO", await stationReadDao.list());

    expect(stationReadDaoSpy).toHaveBeenCalled();
    expect(pluviometerReadDaoSpy).toHaveBeenCalled();
  });
  test.todo("Should be able to get stations by codes");
  test.todo("Should be able to get pluviometers by codes");
  test.todo("Should be able to save equipments");
});
