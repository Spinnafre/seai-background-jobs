// npm run test:dev -i __tests__/units/services/funceme/fetch-pluviometers-measures.spec.js
import {
  afterEach,
  beforeEach,
  describe,
  expect,
  jest,
  test,
} from "@jest/globals";

import { FuncemeServicesFactory } from "../../factories/services/funceme/funceme-services.js";
import { FetchFTPData } from "../../../../src/modules/funceme/services/fetch-ftp-data.js";

import {
  PluviometerReadRepositoryInMemory,
  MetereologicalEquipmentRepositoryInMemory,
} from "../../../doubles/infra/repositories/inMemory";

import { FuncemeScrapperWorkerDTO } from "../../../../src/workers/handlers/funceme/dto.js";
import { FTPClientAdapterMock } from "../../../doubles/infra/services/ftp/ftp-stub.js";

describe("# Pluviometer-Measures-Data-Miner", () => {
  let fetchFtpData = null;
  let metereologicalEquipmentRepositoryInMemory = null;
  let pluviometerReadRepositoryInMemory = null;
  let service = null;
  let ftpAdapterMock = null;

  beforeEach(() => {
    jest.useFakeTimers("modern");
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  beforeEach(() => {
    ftpAdapterMock = new FTPClientAdapterMock();
    fetchFtpData = new FetchFTPData(ftpAdapterMock);

    metereologicalEquipmentRepositoryInMemory =
      new MetereologicalEquipmentRepositoryInMemory();
    pluviometerReadRepositoryInMemory = new PluviometerReadRepositoryInMemory();

    service = new FuncemeServicesFactory({
      FetchFTPData: fetchFtpData,
      MetereologicalEquipmentRepository:
        metereologicalEquipmentRepositoryInMemory,
      PluviometerReadRepository: pluviometerReadRepositoryInMemory,
    }).makeFetchFuncemePluviometerMeasures();
  });

  test("When FTP folder not exists should be able to exit with error", async function () {
    jest.setSystemTime(new Date(1920, 4, 2));

    const eqpCode = "23984";

    const equipments = [
      {
        IdEquipment: 2,
        IdEquipmentExternal: eqpCode,
        Name: "Teste",
        Altitude: null,
        Organ_Id: 2,
        Organ: "FUNCEME",
        Type: "pluviometer",
        CreatedAt: new Date(),
        UpdatedAt: null,
      },
    ];

    const pluviometerRepositorySpy = jest.spyOn(
      pluviometerReadRepositoryInMemory,
      "create"
    );

    await metereologicalEquipmentRepositoryInMemory.createMetereologicalEquipment(
      equipments[0]
    );

    jest
      .spyOn(ftpAdapterMock, "getFolderContentDescription")
      .mockResolvedValue([
        {
          type: "-",
          name: "stn_data_XXX.tar.gz",
          size: 100,
          date: new Date(),
        },
      ]);

    const dto = new FuncemeScrapperWorkerDTO();

    await service.execute(dto);

    const logs = service.getLogs();

    expect(pluviometerRepositorySpy).not.toBeCalled();

    const measures = await pluviometerReadRepositoryInMemory.list();

    expect(measures.length).toBe(0);

    expect(logs).toEqual([
      {
        type: "error",
        message:
          "Não foi possível encontrar arquivo de pluviometer da pasta pluviometros",
      },
    ]);
  });

  test("When has equipments but measures not exists, should be able to save measures data with null", async function () {
    const year = 2023;
    jest.setSystemTime(new Date(year, 11, 12));

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

    jest
      .spyOn(ftpAdapterMock, "getFolderContentDescription")
      .mockResolvedValue([
        {
          type: "-",
          name: `prec_data_${year}.tar.gz`,
          size: 100,
          date: new Date(),
        },
      ]);

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
        type: "warning",
        message: `Não foi possível obter dados de medições do equipamento ${
          equipments[0].IdEquipmentExternal
        } do dia ${request.getDate()}, salvando dados sem medições.`,
        raw: {
          equipment: equipments[0].IdEquipment,
        },
      },
    ]);
  });

  test("When has pluviometer measures in funceme files, should create log with success and save data with measures", async function () {
    const year = 2023;
    jest.setSystemTime(new Date(year, 1, 25));

    const eqpCode = "23978";

    const equipments = [
      {
        IdEquipment: 2,
        IdEquipmentExternal: eqpCode,
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

    jest
      .spyOn(ftpAdapterMock, "getFolderContentDescription")
      .mockResolvedValue([
        {
          type: "-",
          name: `prec_data_${year}.tar.gz`,
          size: 100,
          date: new Date(),
        },
      ]);

    await metereologicalEquipmentRepositoryInMemory.createMetereologicalEquipment(
      equipments[0]
    );
    // Irá ser responsabilidade de um serviço principal
    const request = new FuncemeScrapperWorkerDTO();

    await service.execute(request);

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
        message: `Sucesso ao obter dados de medições do equipamento ${eqpCode}`,
        raw: {
          equipment: equipments[0].IdEquipment,
        },
      },
    ]);
  });

  test("When pluviometers codes not exists in funceme stations files, should create log with error and save data without measures", async function () {
    const year = 2023;
    jest.setSystemTime(new Date(year, 3, 4));

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

    jest
      .spyOn(ftpAdapterMock, "getFolderContentDescription")
      .mockResolvedValue([
        {
          type: "-",
          name: `prec_data_${year}.tar.gz`,
          size: 100,
          date: new Date(),
        },
      ]);

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
        type: "warning",
        message: `Não foi possível obter dados de medições do equipamento ${equipmentCode} do dia ${request.getDate()}, salvando dados sem medições.`,
        raw: {
          equipment: equipments[0].IdEquipment,
        },
      },
    ]);
  });
});
