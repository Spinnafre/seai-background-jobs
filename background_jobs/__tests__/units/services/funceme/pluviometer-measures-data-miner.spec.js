// npm run test:dev -i __tests__/units/services/funceme/pluviometer-measures-data-miner.spec.js
import {
  afterEach,
  beforeEach,
  describe,
  expect,
  jest,
  test,
} from "@jest/globals";

import { FTPClientAdapterMock } from "../../mock/funceme/ftp/connection.js";

import { PluviometerMapper } from "../../../../src/jobs/scrapper/core/mappers/pluviometer-mapper.js";

import { MetereologicalEquipmentInMemory } from "../../database/inMemory/entities/metereologicalEquipment.js";
import { PluviometerRead } from "../../database/inMemory/entities/pluviometerRead.js";

import { FuncemeDataMinerDTO } from "../../../../src/jobs/scrapper/funceme/command-handler/input-boundary.js";
import { FetchFuncemeData } from "../../../../src/jobs/scrapper/funceme/helpers/fetch-data/fetch-data.js";
import { PluviometerParser } from "../../../../src/jobs/scrapper/funceme/helpers/parser/pluviometer-parser.js";
import { ExtractPluviometersFromFunceme } from "../../../../src/jobs/scrapper/funceme/services/pluviometers-measures/pluviometers-measures-data-miner.js";

let ftpAdapterMock = null;
let metereologicalEquipmentDao = null;
let pluviometerReadDao = null;
let fetchFuncemeData = null;
let service = null;

describe("# Pluviometer-Measures-Data-Miner", () => {
  beforeEach(() => {
    jest.useFakeTimers("modern");
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

    service = new ExtractPluviometersFromFunceme(
      fetchFuncemeData,
      metereologicalEquipmentDao,
      pluviometerReadDao
    );
  });

  test("When has equipments but measures not exists, should be able to save measures data with null", async function () {
    jest.setSystemTime(new Date(2023, 5, 12));
    const equipments = [
      {
        IdEquipment: 2,
        IdEquipmentExternal: "23984",
        Name: "Teste",
        Altitude: null,
        Organ_Id: 2,
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

    // Irá ser responsabilidade de um serviço principal
    const lastDate = new FuncemeDataMinerDTO(Date.now());

    await service.execute(lastDate);

    const logs = service.getLogs();

    expect(pluviometerReadDaoSpy).toHaveBeenCalled();

    const pluviometers = await pluviometerReadDao.list();

    pluviometers.forEach((pluviometer) => {
      expect(pluviometer).toMatchObject({
        Value: null,
        FK_Organ: 2,
        FK_Equipment: 2,
      });
    });

    expect(logs).toEqual([
      {
        type: "info",
        message:
          "Iniciando busca de dados de medições de pluviômetros da FUNCEME",
      },
      {
        type: "warning",
        message:
          "Não foi possível obter dados de medição do pluviômetro 23984, salvando dados sem medições.",
      },
      {
        type: "info",
        message: "Sucesso ao salvar leituras de pluviômetros da FUNCEME",
      },
    ]);
  });

  test("When has pluviometer measures in funceme files, should create log with success and save data with measures", async function () {
    jest.setSystemTime(new Date(2023, 3, 4));

    const equipments = [
      {
        IdEquipment: 2,
        IdEquipmentExternal: "23984",
        Name: "Teste",
        Altitude: null,
        Organ_Id: 2,
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
    // Irá ser responsabilidade de um serviço principal
    const lastDate = new FuncemeDataMinerDTO(Date.now());

    await service.execute(lastDate);

    expect(pluviometerReadDaoSpy).toHaveBeenCalled();

    const logs = service.getLogs();

    const pluviometers = await pluviometerReadDao.list();

    pluviometers.forEach((pluviometer) => {
      expect(pluviometer).toMatchObject({
        FK_Organ: 2,
        FK_Equipment: 2,
      });
      expect(pluviometer.Value).toBeGreaterThan(0);
    });

    expect(logs).toEqual([
      {
        type: "info",
        message:
          "Iniciando busca de dados de medições de pluviômetros da FUNCEME",
      },
      {
        type: "info",
        message: "Sucesso ao obter dados de medição do pluviômetro 23984",
      },
      {
        type: "info",
        message: "Sucesso ao salvar leituras de pluviômetros da FUNCEME",
      },
    ]);
  });

  test("When pluviometers codes not exists in funceme stations files, should create log with error and save data without measures", async function () {
    jest.setSystemTime(new Date(2023, 3, 4));
    const equipmentCode = "@3123123s";
    const equipments = [
      {
        IdEquipment: 2,
        IdEquipmentExternal: equipmentCode,
        Name: "Teste",
        Altitude: null,
        Organ_Id: 2,
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

    // Irá ser responsabilidade de um serviço principal
    const lastDate = new FuncemeDataMinerDTO(Date.now());

    await service.execute(lastDate);

    expect(pluviometerReadDaoSpy).toHaveBeenCalled();

    const pluviometers = await pluviometerReadDao.list();

    pluviometers.forEach((pluviometer) => {
      expect(pluviometer).toMatchObject({
        Value: null,
        FK_Organ: 2,
        FK_Equipment: 2,
      });
    });

    const logs = service.getLogs();

    expect(logs).toMatchObject([
      {
        type: "info",
        message:
          "Iniciando busca de dados de medições de pluviômetros da FUNCEME",
      },
      {
        type: "warning",
        message: `Não foi possível obter dados de medição do pluviômetro ${equipmentCode}, salvando dados sem medições.`,
      },
      {
        type: "info",
        message: "Sucesso ao salvar leituras de pluviômetros da FUNCEME",
      },
    ]);
  });
});
