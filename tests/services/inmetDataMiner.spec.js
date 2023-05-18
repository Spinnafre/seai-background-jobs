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

import { Scrapper } from "../../src/modules/scrapper/infra/scrapper/webScrapper/adapters/puppeteer.js";
import { InmetDataMiner } from "../../src/modules/scrapper/infra/scrapper/webScrapper/InmetDataMiner.js";

import { StationDataMiner } from "../../src/modules/scrapper/inmet/services/stationDataMiner.js";

import { MetereologicalEquipmentInMemory } from "../../src/modules/scrapper/infra/database/inMemory/entities/metereologicalEquipment.js";

import { StationRead } from "../../src/modules/scrapper/infra/database/inMemory/entities/stationRead.js";

// import { ReadTimeInMemory } from "../../src/infra/database/inMemoryDataAccess/readTime.js";

// import {
//   formatDateToForwardSlash,
//   getYesterdayTimestamp,
// } from "../../src/utils/date.js";

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
let service = null;
let dataMiner = null;
let scrapper = null;

describe("#Extrat station from inmet service", () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  beforeEach(() => {
    scrapper = new Scrapper({
      bypass: true,
      launch: {
        headless: true,
        args: ["--no-sandbox"],
      },
      timeout: 60000,
      userAgent:
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/84.0.4147.125 Safari/537.36",
    });
    dataMiner = new InmetDataMiner(scrapper);
    metereologicalEquipmentDao = new MetereologicalEquipmentInMemory();
    stationReadDao = new StationRead();

    service = new StationDataMiner(
      dataMiner,
      metereologicalEquipmentDao,
      stationReadDao
    );
  });

  test("When stations equipments not exists, shouldn't be able to get stations from INMET page", async function () {
    // const yesterdayDate = getYesterdayTimestamp();
    // Irá ser responsabilidade de um serviço principal
    // const lastDate = {
    //   IdTime: 1,
    //   Time: yesterdayDate,
    // };

    // const getStationsSpy = jest.spyOn(inmetDataMiner, "getStations");
    const saveStationsReadsSpy = jest.spyOn(stationReadDao, "create");

    await service.execute();

    // expect(getStationsSpy).not.toBeCalled();
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

    const fn = jest.mo;

    await metereologicalEquipmentDao.createMetereologicalEquipment(equipments);

    // const yesterdayDate = getYesterdayTimestamp();

    // const lastDate = {
    //   IdTime: 1,
    //   Time: yesterdayDate,
    // };

    await service.execute();

    const station = await stationReadDao.list();

    console.log(station);
  });

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
