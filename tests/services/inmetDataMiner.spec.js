// npm run test:dev -i tests/services/inmetDataMiner.spec.js

import {
  describe,
  expect,
  test,
  jest,
  afterEach,
  beforeEach,
} from "@jest/globals";

import { ScrapperMock } from "../mock/infra/scrapper.js";

import { InmetDataMiner } from "../../src/modules/scrapper/infra/scrapper/webScrapper/InmetDataMiner.js";

import { StationDataMiner } from "../../src/modules/scrapper/inmet/services/stationDataMiner.js";

import { MetereologicalEquipmentInMemory } from "../../src/modules/scrapper/infra/database/inMemory/entities/metereologicalEquipment.js";

import { StationRead } from "../../src/modules/scrapper/infra/database/inMemory/entities/stationRead.js";
import { PluviometerRead } from "../../src/modules/scrapper/infra/database/inMemory/entities/pluviometerRead.js";

import humidityMock from "../mock/inmet/data/automatic_stations/humidity.json";
import pluviometerMock from "../mock/inmet/data/automatic_stations/pluviometers.json";
import temperatureMock from "../mock/inmet/data/automatic_stations/temperature.json";
import windVelocityMock from "../mock/inmet/data/automatic_stations/windvelocity.json";

let metereologicalEquipmentDao = null;
let stationReadDao = null;
let pluviometerReadDao = null;
let service = null;
let dataMiner = null;
let scrapper = null;

describe("#Extrat station from inmet service", () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  beforeEach(() => {
    scrapper = new ScrapperMock();

    dataMiner = new InmetDataMiner(scrapper);
    metereologicalEquipmentDao = new MetereologicalEquipmentInMemory();

    stationReadDao = new StationRead();
    pluviometerReadDao = new PluviometerRead();

    service = new StationDataMiner(
      dataMiner,
      metereologicalEquipmentDao,
      stationReadDao,
      pluviometerReadDao
    );
  });

  test("When stations equipments not exists, shouldn't be able to get stations from INMET page", async function () {
    const saveStationsReadsSpy = jest.spyOn(stationReadDao, "create");

    await service.execute();

    expect(saveStationsReadsSpy).not.toBeCalled();
  });

  test("When has stations measures, should create log with success and save in persistency", async function () {
    const equipments = [
      {
        IdEquipment: 1,
        IdEquipmentExternal: "A305",
        Name: "Fortaleza",
        Altitude: 35,
        FK_Organ: 2,
        FK_Type: 1,
        Type: "station",
        Organ: "INMET",
        CreatedAt: new Date(),
        UpdatedAt: null,
      },
    ];

    const getAverageTemperatureFunc = jest.spyOn(
      dataMiner,
      "getAverageTemperature"
    );

    getAverageTemperatureFunc.mockImplementation(async () => {
      return temperatureMock.estacoes;
    });

    const getAverageHumidityFunc = jest.spyOn(dataMiner, "getAverageHumidity");

    getAverageHumidityFunc.mockImplementation(async () => {
      return humidityMock.estacoes;
    });

    const getAverageWindVelocityFunc = jest.spyOn(
      dataMiner,
      "getAverageWindVelocity"
    );

    getAverageWindVelocityFunc.mockImplementation(async () => {
      return windVelocityMock.estacoes;
    });

    await metereologicalEquipmentDao.createMetereologicalEquipment(equipments);

    await service.execute();

    const station = await stationReadDao.list();

    expect(station.length).toBe(1);

    expect(station[0]).toMatchObject({
      TotalRadiation: null,
      RelativeHumidity: 75.1,
      AtmosphericTemperature: 27.5,
      WindVelocity: 1.8,
      FK_Organ: 2,
      FK_Equipment: 1,
    });
  });

  test("When has pluviometers measures, should create log with success and save in persistency", async function () {
    const equipments = [
      {
        IdEquipment: 1,
        IdEquipmentExternal: "A305",
        Name: "Fortaleza",
        Altitude: 35,
        FK_Organ: 2,
        FK_Type: 1,
        Type: "pluviometer",
        Organ: "INMET",
        CreatedAt: new Date(),
        UpdatedAt: null,
      },
    ];

    const getPluviometers = jest.spyOn(dataMiner, "getPluviometers");

    getPluviometers.mockImplementation(async () => {
      return pluviometerMock.estacoes;
    });

    await metereologicalEquipmentDao.createMetereologicalEquipment(equipments);

    await service.execute();

    const pluviometer = await pluviometerReadDao.list();

    expect(pluviometer.length).toBe(1);

    expect(pluviometer[0]).toMatchObject({
      Value: null,
      FK_Organ: 2,
      FK_Equipment: 1,
    });
  });

  test.todo(
    "When stations codes not exists in INMET stations, should create log with error and save stations without measures"
  );

  test.todo(
    "When stations codes not exists in INMET stations , should create log with error and save stations without measures"
  );
});
