// npm run test:dev -i tests/services/inmetDataMiner.spec.js

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

import { InmetScrapper } from "../../src/infra/scrapper/inmet-scrapper.js";

import { InmetDataMiner } from "../../src/services/inmetDataMiner.js";

import { MetereologicalEquipmentInMemory } from "../../src/infra/database/inMemoryDataAccess/metereologicalEquipment.js";

import { StationRead } from "../../src/infra/database/inMemoryDataAccess/stationRead.js";

import { ReadTimeInMemory } from "../../src/infra/database/inMemoryDataAccess/readTime.js";
import {
  formatDateToForwardSlash,
  getYesterdayTimestamp,
} from "../../src/utils/date.js";

jest.setTimeout(60000);

let params = {
  country: "NE",
  stations_type: "automaticas",
  state: "CE",
  date_type: "diario",
  params: [
    "Precipitação Total (mm)",
    "Temp. Média (°C)",
    "Umi. Média (%)",
    "Vel. do Vento Média (m/s)",
  ],
};

let metereologicalEquipmentDao = null;
let stationReadDao = null;
let inmetDataMiner = null;

describe("#Extrat station from inmet service", () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  beforeEach(() => {
    metereologicalEquipmentDao = new MetereologicalEquipmentInMemory();
    inmetScrapper = InmetScrapper;
    stationReadDao = new StationRead();

    inmetDataMiner = new InmetDataMiner(
      inmetScrapper,
      metereologicalEquipmentDao,
      stationReadDao
    );

    readTimeDao = new ReadTimeInMemory();
  });

  test("When stations equipments not exists, shouldn't be able to get stations from INMET page", async function () {
    const yesterdayDate = getYesterdayTimestamp();
    // Irá ser responsabilidade de um serviço principal
    let lastDate = await readTimeDao.getLastDate();

    // Evitar salvar dados no banco com datas repetidas
    if (
      !lastDate ||
      formatDateToForwardSlash(lastDate.Time) !==
        formatDateToForwardSlash(yesterdayDate)
    ) {
      const id = await readTimeDao.create(yesterdayDate);

      lastDate = {
        IdTime: id,
        Time: yesterdayDate,
      };
    }

    const getStationsSpy = jest.spyOn(inmetDataMiner, "getStations");
    const saveStationsReadsSpy = jest.spyOn(stationReadDao, "create");

    await inmetDataMiner.execute(lastDate);

    expect(getStationsSpy).not.toBeCalled();
    expect(saveStationsReadsSpy).not.toBeCalled();
  });

  test("Should be able to get station code,name and location from INMET", async function () {
    const equipments = [
      {
        IdEquipment: 1,
        IdEquipmentExternal: "A305",
        Name: "Fortaleza",
        Altitude: 35,
        Organ: {
          FK_Organ: 2,
          Name: "INMET",
        },
        Type: {
          FK_Type: 1,
          Name: "station",
        },
        CreatedAt: new Date(),
        UpdatedAt: null,
      },
    ];

    await metereologicalEquipmentDao.createMetereologicalEquipment(equipments);

    const yesterdayDate = getYesterdayTimestamp();
    // Irá ser responsabilidade de um serviço principal
    let lastDate = await readTimeDao.getLastDate();

    // Evitar salvar dados no banco com datas repetidas
    if (
      !lastDate ||
      formatDateToForwardSlash(lastDate.Time) !==
        formatDateToForwardSlash(yesterdayDate)
    ) {
      const id = await readTimeDao.create(yesterdayDate);

      lastDate = {
        IdTime: id,
        Time: yesterdayDate,
      };
    }

    await inmetDataMiner.execute(lastDate);

    const station = await stationReadDao.list();

    console.log(station);
  });

  jest.retryTimes(3);
  test("Shouldn't be able to get station from INMET when timeout is equal to tolerance time ", async function () {
    // const service = new ExtractStationsFromInmet(InmetScrapper);
    // const timeout = 2000;
    // const result = await service.execute(params, timeout);
    // expect(result.isSuccess).toBeFalsy();
    // expect(result.error).toBe(`Exceeded the tolerance time limit ${timeout}`);
  });

  test.todo(
    "When has stations measures, should create log with success and save in persistency"
  );

  test.todo(
    "When stations codes not exists in INMET stations, should create log with error and save stations without measures"
  );

  test.todo(
    "When stations codes not exists in INMET stations , should create log with error and save stations without measures"
  );
});
