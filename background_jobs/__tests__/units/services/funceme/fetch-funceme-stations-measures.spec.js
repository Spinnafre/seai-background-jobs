// npm run test:dev -i __tests__/units/services/funceme/fetch-funceme-stations-measures.spec.js

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
import { FuncemeScrapperWorkerDTO } from "../../../../src/workers/handlers/funceme/dto.js";

import {
  StationReadRepositoryInMemory,
  MetereologicalEquipmentRepositoryInMemory,
} from "../../../doubles/infra/repositories/inMemory";

import { FTPClientAdapterMock } from "../../../doubles/infra/services/ftp/ftp-stub.js";

describe("# Station-Measures-Data-Miner", () => {
  let ftpAdapterMock = null;
  let metereologicalEquipmentRepository = null;
  let stationReadRepository = null;
  let service = null;

  beforeEach(() => {
    jest.useFakeTimers("modern");
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  beforeEach(() => {
    ftpAdapterMock = new FTPClientAdapterMock();

    const fetchFtpData = new FetchFTPData(ftpAdapterMock);

    metereologicalEquipmentRepository =
      new MetereologicalEquipmentRepositoryInMemory();
    stationReadRepository = new StationReadRepositoryInMemory();

    service = new FuncemeServicesFactory({
      FetchFTPData: fetchFtpData,
      MetereologicalEquipmentRepository: metereologicalEquipmentRepository,
      StationReadRepository: stationReadRepository,
    }).makeFetchFuncemeStationsMeasures();
  });

  test("When FTP folder not exists should be able to exit with error", async function () {
    jest.setSystemTime(new Date(1920, 4, 2));

    const stationCode = "B8524E9A";

    const equipments = [
      {
        IdEquipment: 1,
        IdEquipmentExternal: stationCode,
        Name: "Fortaleza",
        Altitude: 35,
        Organ_Id: 2,
        Organ: "FUNCEME",
        Type: "station",
        CreatedAt: new Date(),
        UpdatedAt: null,
      },
      {
        IdEquipment: 2,
        IdEquipmentExternal: "A205",
        Name: "Teste",
        Altitude: null,
        Organ_Id: 2,
        Organ: "FUNCEME",
        Type: "pluviometer",
        CreatedAt: new Date(),
        UpdatedAt: null,
      },
    ];

    const stationReadRepositorySpy = jest.spyOn(
      stationReadRepository,
      "create"
    );

    await metereologicalEquipmentRepository.createMetereologicalEquipment(
      equipments[0]
    );
    await metereologicalEquipmentRepository.createMetereologicalEquipment(
      equipments[1]
    );

    const ftpMocked = jest
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

    expect(stationReadRepositorySpy).not.toBeCalled();

    const stationsMeasures = await stationReadRepository.list();

    expect(stationsMeasures.length).toBe(0);

    expect(logs).toEqual([
      {
        type: "error",
        message: "Não foi possível encontrar arquivo de station da pasta pcds",
      },
    ]);
  });

  test("When has equipments but measures is empty, should be able to save measures data with null", async function () {
    const year = 2023;
    jest.setSystemTime(new Date(year, 11, 2));

    const stationCode = "B8524E9A";

    const equipments = [
      {
        IdEquipment: 1,
        IdEquipmentExternal: stationCode,
        Name: "Fortaleza",
        Altitude: 35,
        Organ_Id: 2,
        Organ: "FUNCEME",
        Type: "station",
        CreatedAt: new Date(),
        UpdatedAt: null,
      },
    ];

    const stationReadRepositorySpy = jest.spyOn(
      stationReadRepository,
      "create"
    );

    await metereologicalEquipmentRepository.createMetereologicalEquipment(
      equipments[0]
    );

    const ftpMocked = jest
      .spyOn(ftpAdapterMock, "getFolderContentDescription")
      .mockResolvedValue([
        {
          type: "-",
          name: `stn_data_${year}.tar.gz`,
          size: 100,
          date: new Date(),
        },
      ]);

    const dto = new FuncemeScrapperWorkerDTO();

    await service.execute(dto);

    const logs = service.getLogs();

    expect(stationReadRepositorySpy).toHaveBeenCalled();

    const stationsMeasures = await stationReadRepository.list();

    stationsMeasures.forEach((measure) => {
      expect(measure).toMatchObject({
        TotalRadiation: null,
        MaxRelativeHumidity: null,
        MinRelativeHumidity: null,
        AverageRelativeHumidity: null,
        MaxAtmosphericTemperature: null,
        MinAtmosphericTemperature: null,
        AverageAtmosphericTemperature: null,
        AtmosphericPressure: null,
        WindVelocity: null,
        FK_Organ: 2,
        FK_Equipment: 1,
      });
    });

    expect(logs).toEqual([
      {
        type: "warning",
        message: `Não foi possível obter dados de medições do equipamento ${stationCode} do dia ${dto.getDate()}, salvando dados sem medições.`,
        raw: {
          equipment: equipments[0].IdEquipment,
        },
      },
    ]);
  });

  test("When has stations measures in funceme stations files, should create log with success and save stations with measures", async function () {
    const year = 2023;
    jest.setSystemTime(new Date(year, 0, 2));

    const equipmentCode = "B8524E9A";

    const equipments = [
      {
        IdEquipment: 1,
        IdEquipmentExternal: equipmentCode,
        Name: "Fortaleza",
        Altitude: 35,
        Organ_Id: 2,
        Organ: "FUNCEME",
        Type: "station",
        CreatedAt: new Date(),
        UpdatedAt: null,
      },
    ];

    const ftpMocked = jest
      .spyOn(ftpAdapterMock, "getFolderContentDescription")
      .mockResolvedValue([
        {
          type: "-",
          name: `stn_data_${year}.tar.gz`,
          size: 100,
          date: new Date(),
        },
      ]);

    const stationReadRepositorySpy = jest.spyOn(
      stationReadRepository,
      "create"
    );

    await metereologicalEquipmentRepository.createMetereologicalEquipment(
      equipments[0]
    );

    const dto = new FuncemeScrapperWorkerDTO();

    await service.execute(dto);

    const logs = service.getLogs();

    expect(stationReadRepositorySpy).toHaveBeenCalled();

    const stationsMeasures = await stationReadRepository.list();

    const stationInDatabase = {
      TotalRadiation: 228.68,
      MaxRelativeHumidity: 65.83,
      MinRelativeHumidity: 60.39,
      AverageRelativeHumidity: 62.95,
      MaxAtmosphericTemperature: 30.02,
      MinAtmosphericTemperature: 28.42,
      AverageAtmosphericTemperature: 29.11,
      AtmosphericPressure: 996.2,
      WindVelocity: 3.56,
      FK_Organ: 2,
      FK_Equipment: 1,
    };

    stationsMeasures.forEach((measure) => {
      expect(measure).toMatchObject(stationInDatabase);
    });

    expect(logs).toEqual([
      {
        type: "info",
        message: `Sucesso ao obter dados de medições do equipamento ${equipmentCode}`,
        raw: {
          equipment: equipments[0].IdEquipment,
        },
      },
    ]);
  });

  test("When stations codes not exists in funceme stations files, should create log with error and save stations without measures", async function () {
    const year = 2023;

    jest.setSystemTime(new Date(year, 7, 2));

    const equipments = [
      {
        IdEquipment: 1,
        IdEquipmentExternal: "AA@!@#925",
        Name: "Fortaleza",
        Altitude: 35,
        Organ_Id: 2,
        Organ: "FUNCEME",
        Type: "station",
        CreatedAt: new Date(),
        UpdatedAt: null,
      },
    ];

    const stationReadRepositorySpy = jest.spyOn(
      stationReadRepository,
      "create"
    );

    jest
      .spyOn(ftpAdapterMock, "getFolderContentDescription")
      .mockResolvedValue([
        {
          type: "-",
          name: `stn_data_${year}.tar.gz`,
          size: 100,
          date: new Date(),
        },
      ]);

    await metereologicalEquipmentRepository.createMetereologicalEquipment(
      equipments[0]
    );

    const dto = new FuncemeScrapperWorkerDTO();

    await service.execute(dto);

    expect(stationReadRepositorySpy).toHaveBeenCalled();

    const stationsMeasures = await stationReadRepository.list();

    const stationInDatabase = {
      TotalRadiation: null,
      MaxRelativeHumidity: null,
      MinRelativeHumidity: null,
      AverageRelativeHumidity: null,
      MaxAtmosphericTemperature: null,
      MinAtmosphericTemperature: null,
      AverageAtmosphericTemperature: null,
      AtmosphericPressure: null,
      WindVelocity: null,
      FK_Organ: 2,
      FK_Equipment: 1,
    };

    stationsMeasures.forEach((measure) => {
      expect(measure).toMatchObject(stationInDatabase);
    });

    expect(service.getLogs()).toEqual([
      {
        type: "warning",
        message: `Não foi possível obter dados de medições do equipamento ${
          equipments[0].IdEquipmentExternal
        } do dia ${dto.getDate()}, salvando dados sem medições.`,
        raw: {
          equipment: equipments[0].IdEquipment,
        },
      },
    ]);
  });
});
