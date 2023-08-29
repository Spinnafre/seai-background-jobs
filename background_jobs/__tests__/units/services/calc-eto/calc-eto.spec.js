// npm run test:dev -i __tests__/units/services/calc-eto/calc-eto.spec.js

import {
  describe,
  expect,
  test,
  jest,
  afterEach,
  beforeEach,
  beforeAll,
} from "@jest/globals";
import { CalcETO } from "../../../../src/jobs/calc_eto/services/calc-eto-by-date";
import { MetereologicalEquipmentInMemory } from "../../database/inMemory/entities/metereologicalEquipment";
import { EtoRepositoryInMemory } from "../../database/inMemory/entities/eto";
import { StationReadRepositoryInMemory } from "../../database/inMemory/entities/stationRead";
import { LogsRepositoryInMemory } from "../../database/inMemory/entities/logs";
import { CalcEtoDTO } from "../../../../src/jobs/calc_eto/handler/input-boundary";

let calcEtoInputDTO = null;
describe("# Calc ET0 Service", () => {
  beforeAll(() => {
    calcEtoInputDTO = new CalcEtoDTO(new Date());
  });
  beforeEach(() => {
    jest.useFakeTimers("modern");
    jest.setSystemTime(new Date(2023, 7, 29));
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  test("When has stations equipments, should be able to calculate measures and ET0 and save", async () => {
    const IdEquipment = 1;

    const equipmentRepository = new MetereologicalEquipmentInMemory([
      {
        IdEquipment,
        IdEquipmentExternal: "23984",
        Name: "Teste",
        Altitude: 35,
        FK_Organ: 2,
        Organ: "FUNCEME",
        Type: "station",
        CreatedAt: new Date(),
        UpdatedAt: new Date(),
      },
    ]);

    const readStations = new StationReadRepositoryInMemory([
      {
        IdRead: 1,
        TotalRadiation: 3,
        RelativeHumidity: 2,
        AtmosphericTemperature: 3,
        WindVelocity: null,
        Time: new Date(),
        FK_Organ: 2,
        FK_Equipment: IdEquipment,
      },
    ]);

    const etoRepository = new EtoRepositoryInMemory();

    const logsRepo = new LogsRepositoryInMemory();

    const calcEto = new CalcETO(
      equipmentRepository,
      etoRepository,
      readStations,
      logsRepo
    );

    await calcEto.execute(calcEtoInputDTO);

    const eto = await etoRepository.getValuesByStation(IdEquipment);

    expect(eto).toHaveLength(1);

    expect(eto[0]).toEqual({ Value: 1.9100414403415098, FK_Station_Read: 1 });

    expect(logsRepo.logs).toMatchObject([
      {
        Message: "Sucesso ao calcular dados de ET0 da estação 23984 de test",
        Operation: "",
        Status: "success",
      },
      {
        Message: "Sucesso ao calcular dados de ET0 do dia.",
        Operation: "",
        Status: "success",
      },
    ]);
  });

  test("When stations measures not exists, shouldn't be able to calculate ET0", async () => {
    const IdEquipment = 1;

    const equipmentRepository = new MetereologicalEquipmentInMemory([
      {
        IdEquipment,
        IdEquipmentExternal: "23984",
        Name: "Teste",
        Altitude: 35,
        FK_Organ: 2,
        Organ: "FUNCEME",
        Type: "station",
        CreatedAt: new Date(),
        UpdatedAt: new Date(),
      },
    ]);

    const readStations = new StationReadRepositoryInMemory();

    const etoRepository = new EtoRepositoryInMemory();

    const logsRepo = new LogsRepositoryInMemory();

    const calcEto = new CalcETO(
      equipmentRepository,
      etoRepository,
      readStations,
      logsRepo
    );

    await calcEto.execute(calcEtoInputDTO);

    const eto = await etoRepository.getValuesByStation(IdEquipment);

    expect(eto).toHaveLength(0);

    expect(logsRepo.logs).toMatchObject([
      {
        Message: "Não foi possível calcular ET0 do dia.",
        Operation: "",
        Status: "warning",
      },
    ]);
  });

  test("When average temperature of the stations equipments not exists, shouldn't be able to calculate ET0", async () => {
    const IdEquipment = 1;
    const IdEquipmentExternal = "23984";

    const equipmentRepository = new MetereologicalEquipmentInMemory([
      {
        IdEquipment,
        IdEquipmentExternal,
        Name: "Teste",
        Altitude: 35,
        FK_Organ: 2,
        Organ: "FUNCEME",
        Type: "station",
        CreatedAt: new Date(),
        UpdatedAt: new Date(),
      },
    ]);

    const readStations = new StationReadRepositoryInMemory([
      {
        IdRead: 1,
        TotalRadiation: 3,
        RelativeHumidity: 2,
        AtmosphericTemperature: null,
        WindVelocity: null,
        Time: new Date(),
        FK_Organ: 2,
        FK_Equipment: IdEquipment,
      },
    ]);

    const etoRepository = new EtoRepositoryInMemory();

    const logsRepo = new LogsRepositoryInMemory();

    const calcEto = new CalcETO(
      equipmentRepository,
      etoRepository,
      readStations,
      logsRepo
    );

    await calcEto.execute(calcEtoInputDTO);

    const eto = await etoRepository.getValuesByStation(IdEquipment);

    expect(eto).toHaveLength(0);

    expect(logsRepo.logs).toContainEqual({
      Message: `Não irá computar os dados de ET0 pois não há dados de temperatura atmosférica média da estação ${23984} de test`,
      Operation: "",
      Status: "warning",
    });
  });

  test("When stations equipments not exists, shouldn't be able to calculate ET0", async () => {
    const IdEquipment = 1;

    const equipmentRepository = new MetereologicalEquipmentInMemory();

    const readStations = new StationReadRepositoryInMemory([
      {
        IdRead: 1,
        TotalRadiation: 3,
        RelativeHumidity: 2,
        AtmosphericTemperature: null,
        WindVelocity: null,
        Time: new Date(),
        FK_Organ: 2,
        FK_Equipment: IdEquipment,
      },
    ]);

    const etoRepository = new EtoRepositoryInMemory();

    const logsRepo = new LogsRepositoryInMemory();

    const calcEto = new CalcETO(
      equipmentRepository,
      etoRepository,
      readStations,
      logsRepo
    );

    await calcEto.execute(calcEtoInputDTO);

    const eto = await etoRepository.getValuesByStation(IdEquipment);

    expect(eto).toHaveLength(0);

    expect(logsRepo.logs).toContainEqual({
      Message: "Não foi possível calcular ET0 do dia.",
      Operation: "",
      Status: "warning",
    });
  });
});
