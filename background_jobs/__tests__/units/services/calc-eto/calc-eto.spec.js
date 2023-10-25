// npm run test:dev -i __tests__/units/services/calc-eto/calc-eto.spec.js
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

import { MetereologicalEquipmentRepositoryInMemory } from "../../mock/repositories/inMemory/entities/metereologicalEquipment";
import { StationReadRepositoryInMemory } from "../../mock/repositories/inMemory/entities/stationRead";
import { EtoRepositoryInMemory } from "../../mock/repositories/inMemory/entities/eto";
import { LogsRepositoryInMemory } from "../../mock/repositories/inMemory/entities/logs.js";
import { CalcETOByDate } from "../../../../src/modules/calc-eto/services/calc-eto-by-date.js";
import { CalcEtoWorkerDTO } from "../../../../src/workers/handlers/calc_eto/dto.js";


let calcEtoInputDTO = null;

describe("# Calc ET0 Service", () => {
  beforeAll(() => {
    jest.useFakeTimers("modern");
  });

  beforeEach(() => {
    jest.setSystemTime(new Date(2023, 7, 29));
    calcEtoInputDTO = new CalcEtoWorkerDTO(new Date());
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  test("When has stations equipments, should be able to calculate measures and ET0 and save", async () => {
    const IdEquipment = 1;
    const EXPECTED_ETO = 0.054234816768670216;
    const EquipmentLocation = "Test";
    const IdEquipmentExternal = "23984";

    const equipmentRepository = new MetereologicalEquipmentRepositoryInMemory([
      {
        IdEquipment,
        IdEquipmentExternal: "23984",
        Name: EquipmentLocation,
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
        MaxRelativeHumidity: 45,
        MinRelativeHumidity: 7,
        AverageRelativeHumidity: 2,
        MaxAtmosphericTemperature: 2,
        MinAtmosphericTemperature: 2,
        AverageAtmosphericTemperature: 3,
        AtmosphericPressure: 3,
        WindVelocity: 2,
        Time: calcEtoInputDTO.getDateToQuery().getDate(),
        Hour: null,
        FK_Organ: 2,
        FK_Equipment: IdEquipment,
      },
    ]);

    const etoRepository = new EtoRepositoryInMemory();

    const calcEto = new CalcETOByDate(
      equipmentRepository,
      etoRepository,
      readStations,
    );

    await calcEto.execute(calcEtoInputDTO);

    const eto = await etoRepository.getValuesByStation(IdEquipment);

    expect(eto).toHaveLength(1);

    expect(eto[0]).toEqual({ Value: EXPECTED_ETO, FK_Station_Read: 1 });

    expect(calcEto.getLogs()).toMatchObject([
      {
        message: `Sucesso ao calcular dados de ET0 da estação ${IdEquipmentExternal} de ${EquipmentLocation}`,
        type: "info",
      },
      {
        message: "Sucesso ao calcular dados de ET0 do dia.",
        type: "info",
      },
    ]);
  });

  test("When stations measures not exists, shouldn't be able to calculate ET0", async () => {
    const IdEquipment = 1;
    const equipmentLocation = "Test";
    const IdEquipmentExternal = "23984";

    const equipmentRepository = new MetereologicalEquipmentRepositoryInMemory([
      {
        IdEquipment,
        IdEquipmentExternal,
        Name: equipmentLocation,
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

    const calcEto = new CalcETOByDate(
      equipmentRepository,
      etoRepository,
      readStations,
    );

    await calcEto.execute(calcEtoInputDTO);

    const eto = await etoRepository.getValuesByStation(IdEquipment);

    expect(eto).toHaveLength(0);

    expect(calcEto.getLogs()).toMatchObject([
      {
        message: `Não há dados de medições da estação ${IdEquipmentExternal} de ${equipmentLocation}`,
        type: "warning",
      },
    ]);
  });

  test("When average temperature of the stations equipments not exists, shouldn't be able to calculate ET0", async () => {
    const IdEquipment = 1;
    const IdEquipmentExternal = "23984";
    const equipmentLocation = "Test";

    const equipmentRepository = new MetereologicalEquipmentRepositoryInMemory([
      {
        IdEquipment,
        IdEquipmentExternal,
        Name: equipmentLocation,
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
        MaxRelativeHumidity: 45,
        MinRelativeHumidity: 7,
        AverageRelativeHumidity: 2,
        MaxAtmosphericTemperature: 2,
        MinAtmosphericTemperature: 2,
        AverageAtmosphericTemperature: null,
        AtmosphericPressure: 3,
        WindVelocity: 2,
        Time: calcEtoInputDTO.getDateToQuery().getDate(),
        Hour: null,
        FK_Organ: 2,
        FK_Equipment: IdEquipment,
      },
    ]);

    const etoRepository = new EtoRepositoryInMemory();

    const calcEto = new CalcETOByDate(
      equipmentRepository,
      etoRepository,
      readStations
    );

    await calcEto.execute(calcEtoInputDTO);

    const eto = await etoRepository.getValuesByStation(IdEquipment);

    expect(eto).toHaveLength(0);

    expect(calcEto.getLogs()).toContainEqual({
      message: `Não irá computar os dados de ET0 pois não há dados de temperatura atmosférica média da estação ${IdEquipmentExternal} de ${equipmentLocation}`,
      type: "warning",
    });
  });

  test("When maximum and minimum atmospheric temperatures do not exits, should be able to estimate the temperatures", async () => {
    const IdEquipment = 1;
    const IdEquipmentExternal = "23984";
    const equipmentLocation = "Test";

    const equipmentRepository = new MetereologicalEquipmentRepositoryInMemory([
      {
        IdEquipment,
        IdEquipmentExternal,
        Name: equipmentLocation,
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
        MaxRelativeHumidity: 45,
        MinRelativeHumidity: 7,
        AverageRelativeHumidity: 2,
        MaxAtmosphericTemperature: null,
        MinAtmosphericTemperature: null,
        AverageAtmosphericTemperature: 3,
        AtmosphericPressure: 3,
        WindVelocity: 2,
        Time: calcEtoInputDTO.getDateToQuery().getDate(),
        Hour: null,
        FK_Organ: 2,
        FK_Equipment: IdEquipment,
      },
    ]);

    const etoRepository = new EtoRepositoryInMemory();

    const calcEto = new CalcETOByDate(
      equipmentRepository,
      etoRepository,
      readStations
    );

    await calcEto.execute(calcEtoInputDTO);

    expect(calcEto.getLogs()).toEqual([
      {
        message: `Não há dados de temperatura máxima ou mínima da estação ${IdEquipmentExternal} de ${equipmentLocation}, portanto os valores irão serem estimados.`,
        type: "warning",
      },
      {
        message: `Sucesso ao calcular dados de ET0 da estação ${IdEquipmentExternal} de ${equipmentLocation}`,
        type: "info",
      },
      { message: "Sucesso ao calcular dados de ET0 do dia.", type: "info" },
    ]);
  });

  test("When total radiation do not exits, should be able to estimate the radiation", async () => {
    const IdEquipment = 1;
    const IdEquipmentExternal = "23984";
    const equipmentLocation = "Test";

    const equipmentRepository = new MetereologicalEquipmentRepositoryInMemory([
      {
        IdEquipment,
        IdEquipmentExternal,
        Name: equipmentLocation,
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
        TotalRadiation: null,
        MaxRelativeHumidity: 45,
        MinRelativeHumidity: 7,
        AverageRelativeHumidity: 2,
        MaxAtmosphericTemperature: 2,
        MinAtmosphericTemperature: 3,
        AverageAtmosphericTemperature: 3,
        AtmosphericPressure: 3,
        WindVelocity: 2,
        Time: calcEtoInputDTO.getDateToQuery().getDate(),
        Hour: null,
        FK_Organ: 2,
        FK_Equipment: IdEquipment,
      },
    ]);

    const etoRepository = new EtoRepositoryInMemory();


    const calcEto = new CalcETOByDate(
      equipmentRepository,
      etoRepository,
      readStations,
    );

    await calcEto.execute(calcEtoInputDTO);

    expect(calcEto.getLogs()).toEqual([
      {
        message: `Não há dados de radiação solar média da estação ${IdEquipmentExternal} de ${equipmentLocation}, portanto irá ser estimado o valor da radiação solar.`,
        type: "warning",
      },
      {
        message: `Sucesso ao calcular dados de ET0 da estação ${IdEquipmentExternal} de ${equipmentLocation}`,
        type: "info",
      },
      { message: "Sucesso ao calcular dados de ET0 do dia.", type: "info" },
    ]);
  });

  test("When atmospheric pressure do not exits, should be able to estimate the pressure", async () => {
    const IdEquipment = 1;
    const IdEquipmentExternal = "23984";
    const equipmentLocation = "Test";

    const equipmentRepository = new MetereologicalEquipmentRepositoryInMemory([
      {
        IdEquipment,
        IdEquipmentExternal,
        Name: equipmentLocation,
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
        MaxRelativeHumidity: 45,
        MinRelativeHumidity: 7,
        AverageRelativeHumidity: 2,
        MaxAtmosphericTemperature: 2,
        MinAtmosphericTemperature: 3,
        AverageAtmosphericTemperature: 3,
        AtmosphericPressure: null,
        WindVelocity: 2,
        Time: calcEtoInputDTO.getDateToQuery().getDate(),
        Hour: null,
        FK_Organ: 2,
        FK_Equipment: IdEquipment,
      },
    ]);

    const etoRepository = new EtoRepositoryInMemory();

    const logsRepo = new LogsRepositoryInMemory();

    const calcEto = new CalcETOByDate(
      equipmentRepository,
      etoRepository,
      readStations,
      logsRepo
    );

    await calcEto.execute(calcEtoInputDTO);

    expect(calcEto.getLogs()).toEqual([
      {
        message: `Não há dados de pressão atmosférica da estação ${IdEquipmentExternal} de ${equipmentLocation}, portanto o valor irá ser estimado.`,
        type: "warning",
      },
      {
        message: `Sucesso ao calcular dados de ET0 da estação ${IdEquipmentExternal} de ${equipmentLocation}`,
        type: "info",
      },
      { message: "Sucesso ao calcular dados de ET0 do dia.", type: "info" },
    ]);
  });

  test("When wind velocity do not exits, should be able to estimate the measure", async () => {
    const IdEquipment = 1;
    const IdEquipmentExternal = "23984";
    const equipmentLocation = "Test";

    const equipmentRepository = new MetereologicalEquipmentRepositoryInMemory([
      {
        IdEquipment,
        IdEquipmentExternal,
        Name: equipmentLocation,
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
        MaxRelativeHumidity: 45,
        MinRelativeHumidity: 7,
        AverageRelativeHumidity: 2,
        MaxAtmosphericTemperature: 2,
        MinAtmosphericTemperature: 3,
        AverageAtmosphericTemperature: 3,
        AtmosphericPressure: 3,
        WindVelocity: null,
        Time: calcEtoInputDTO.getDateToQuery().getDate(),
        Hour: null,
        FK_Organ: 2,
        FK_Equipment: IdEquipment,
      },
    ]);

    const etoRepository = new EtoRepositoryInMemory();

    const logsRepo = new LogsRepositoryInMemory();

    const calcEto = new CalcETOByDate(
      equipmentRepository,
      etoRepository,
      readStations,
      logsRepo
    );

    await calcEto.execute(calcEtoInputDTO);

    expect(calcEto.getLogs()).toEqual([
      {
        message: `Não há dados da velocidade média do vento da estação ${IdEquipmentExternal} de ${equipmentLocation}, portanto irá ser adotado o valor de referência de 2 m/s.`,
        type: "warning",
      },
      {
        message: `Sucesso ao calcular dados de ET0 da estação ${IdEquipmentExternal} de ${equipmentLocation}`,
        type: "info",
      },
      { message: "Sucesso ao calcular dados de ET0 do dia.", type: "info" },
    ]);
  });

  test("When average relative humidity do not exits, should be able to estimate the measure", async () => {
    const IdEquipment = 1;
    const IdEquipmentExternal = "23984";
    const equipmentLocation = "Test";

    const equipmentRepository = new MetereologicalEquipmentRepositoryInMemory([
      {
        IdEquipment,
        IdEquipmentExternal,
        Name: equipmentLocation,
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
        MaxRelativeHumidity: 45,
        MinRelativeHumidity: 7,
        AverageRelativeHumidity: null,
        MaxAtmosphericTemperature: 2,
        MinAtmosphericTemperature: 3,
        AverageAtmosphericTemperature: 3,
        AtmosphericPressure: 3,
        WindVelocity: 5,
        Time: calcEtoInputDTO.getDateToQuery().getDate(),
        Hour: null,
        FK_Organ: 2,
        FK_Equipment: IdEquipment,
      },
    ]);

    const etoRepository = new EtoRepositoryInMemory();

    const calcEto = new CalcETOByDate(
      equipmentRepository,
      etoRepository,
      readStations,
    );

    await calcEto.execute(calcEtoInputDTO);

    expect(calcEto.getLogs()).toEqual([
      {
        message: `Não há dados de umidade relativa média da estação ${IdEquipmentExternal} de ${equipmentLocation}, portanto irá ser estimado o valor da umidade média.`,
        type: "warning",
      },
      {
        message: `Sucesso ao calcular dados de ET0 da estação ${IdEquipmentExternal} de ${equipmentLocation}`,
        type: "info",
      },
      { message: "Sucesso ao calcular dados de ET0 do dia.", type: "info" },
    ]);
  });

  test("When stations equipments not exists, shouldn't be able to calculate ET0", async () => {
    const IdEquipment = 1;

    const equipmentRepository = new MetereologicalEquipmentRepositoryInMemory();

    const readStations = new StationReadRepositoryInMemory([
      {
        IdRead: 1,
        TotalRadiation: 3,
        MaxRelativeHumidity: 45,
        MinRelativeHumidity: 7,
        AverageRelativeHumidity: 2,
        MaxAtmosphericTemperature: 2,
        MinAtmosphericTemperature: 2,
        AverageAtmosphericTemperature: null,
        AtmosphericPressure: 3,
        WindVelocity: 2,
        Time: calcEtoInputDTO.getDateToQuery().getDate(),
        Hour: null,
        FK_Organ: 2,
        FK_Equipment: IdEquipment,
      },
    ]);

    const etoRepository = new EtoRepositoryInMemory();

    const calcEto = new CalcETOByDate(
      equipmentRepository,
      etoRepository,
      readStations,
    );

    await calcEto.execute(calcEtoInputDTO);

    const eto = await etoRepository.getValuesByStation(IdEquipment);

    expect(eto).toHaveLength(0);


    expect(calcEto.getLogs()).toContainEqual({
      message: "Não há equipamentos de estação cadastrados.",
      type: "error",
    });
  });
});
