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

import { MetereologicalEquipmentInMemory } from "../../src/infra/database/inMemoryDataAccess/metereologicalEquipment.js";

let funcemeDataMiner = null;

let ftp = null;
let gateway = null;

let metereologicalEquipmentDao = null;
let stationReadDao = null;
let pluviometerReadDao = null;

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

    funcemeDataMiner = new FuncemeDataMiner(
      gateway,
      metereologicalEquipmentDao,
      stationReadDao,
      pluviometerReadDao
    );
  });

  test("Should be able to get equipments by types", async function () {
    const equipments = [
      {
        IdEquipment: 1,
        IdEquipmentExternal: "A305",
        Name: "Fortaleza-CE",
        Altitude: 35,
        FK_Organ: 2,
        FK_Type: 1,
        CreatedAt: new Date(),
        UpdatedAt: null,
      },
      {
        IdEquipment: 3,
        IdEquipmentExternal: "23984",
        Name: "Teste",
        Altitude: null,
        FK_Organ: 2,
        FK_Type: 2,
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

    const stationReadDaoSpy = jest.spyOn(stationReadDao, "create");
    const pluviometerReadDaoSpy = jest.spyOn(pluviometerReadDao, "create");

    await metereologicalEquipmentDao.createMetereologicalEquipment(equipments);

    await metereologicalEquipmentDao.createMetereologicalOrgan(organs);

    await metereologicalEquipmentDao.createEquipmentType(equipmentType);

    await funcemeDataMiner.execute();

    console.log("REPOSITÓRIO", await stationReadDao.list());

    expect(stationReadDaoSpy).toHaveBeenCalled();
    expect(pluviometerReadDaoSpy).toHaveBeenCalled();
  });
  test.todo("Should be able to get stations by codes");
  test.todo("Should be able to get pluviometers by codes");
  test.todo("Should be able to save equipments");
});
