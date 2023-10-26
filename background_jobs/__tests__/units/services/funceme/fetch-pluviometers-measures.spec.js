// npm run test:dev -i __tests__/units/services/funceme/pluviometer-measures-data-miner.spec.js
import {
  afterEach,
  beforeEach,
  describe,
  expect,
  jest,
  test,
} from "@jest/globals";

import { FetchFTPData } from "../../../../src/modules/funceme/services/fetch-ftp-data.js";
import { FuncemeServicesBuilder } from "../../factories/services/funceme/funceme-services.js";
import { MetereologicalEquipmentRepositoryInMemory } from "../../mock/repositories/inMemory/entities/metereologicalEquipment.js";
import { PluviometerReadRepositoryInMemory } from "../../mock/repositories/inMemory/entities/pluviometerRead.js";
import { FuncemeScrapperWorkerDTO } from "../../../../src/workers/handlers/funceme/dto.js";
import { FTPClientAdapterMock } from "../../mock/funceme/ftp/connection.js";

let fetchFtpData = null;
let metereologicalEquipmentRepositoryInMemory = null;
let pluviometerReadRepositoryInMemory = null;
let service = null;
let ftpClientAdapter = null;

describe("# Pluviometer-Measures-Data-Miner", () => {
  beforeEach(() => {
    jest.useFakeTimers("modern");
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  beforeEach(() => {
    ftpClientAdapter = new FTPClientAdapterMock();
    fetchFtpData = new FetchFTPData(ftpClientAdapter);

    metereologicalEquipmentRepositoryInMemory =
      new MetereologicalEquipmentRepositoryInMemory();
    pluviometerReadRepositoryInMemory = new PluviometerReadRepositoryInMemory();

    service = new FuncemeServicesBuilder({
      FetchFTPData: fetchFtpData,
      MetereologicalEquipmentRepositoryInMemory:
        metereologicalEquipmentRepositoryInMemory,
      PluviometerReadRepositoryInMemory: pluviometerReadRepositoryInMemory,
    }).makeFetchFuncemePluviometerMeasures();
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

    const pluviometerReadRepositoryInMemorySpy = jest.spyOn(
      pluviometerReadRepositoryInMemory,
      "create"
    );

    await metereologicalEquipmentRepositoryInMemory.createMetereologicalEquipment(
      equipments[0]
    );

    // Irá ser responsabilidade de um serviço principal
    const request = new FuncemeScrapperWorkerDTO();

    await service.execute(request);

    const logs = service.getLogs();

    expect(pluviometerReadRepositoryInMemorySpy).toHaveBeenCalled();

    const pluviometers = await pluviometerReadRepositoryInMemory.list();

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

    const pluviometerReadRepositoryInMemorySpy = jest.spyOn(
      pluviometerReadRepositoryInMemory,
      "create"
    );

    await metereologicalEquipmentRepositoryInMemory.createMetereologicalEquipment(
      equipments[0]
    );
    // Irá ser responsabilidade de um serviço principal
    const lastDate = new FuncemeDataMinerDTO(Date.now());

    await service.execute(lastDate);

    expect(pluviometerReadRepositoryInMemorySpy).toHaveBeenCalled();

    const logs = service.getLogs();

    const pluviometers = await pluviometerReadRepositoryInMemory.list();

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

    const pluviometerReadRepositoryInMemorySpy = jest.spyOn(
      pluviometerReadRepositoryInMemory,
      "create"
    );

    await metereologicalEquipmentRepositoryInMemory.createMetereologicalEquipment(
      equipments[0]
    );

    // Irá ser responsabilidade de um serviço principal
    const lastDate = new FuncemeDataMinerDTO(Date.now());

    await service.execute(lastDate);

    expect(pluviometerReadRepositoryInMemorySpy).toHaveBeenCalled();

    const pluviometers = await pluviometerReadRepositoryInMemory.list();

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
