// npm run test:dev -i __tests__/units/services/funceme/fetch-funceme-stations-measures.spec.js

import {
  afterEach,
  beforeEach,
  describe,
  expect,
  jest,
  test,
} from "@jest/globals";

import { MetereologicalEquipmentRepositoryInMemory } from "..//doubles/infra/repositories/inMemory/metereologicalEquipment.js";
import { MetereologicalOrganRepositoryInMemory } from "../doubles/infra/repositories/inMemory/metereologicalOrganRepository.js";
import { FTPClientAdapterMock } from "../doubles/infra/ftp/ftp-stub.js";

import { EquipmentCommand } from "../../services/commands/command.js";

import { FetchEquipmentsMeasures } from "../../services/measurements/fetch-measurements.js";

import { FetchFuncemeEquipments } from "../../data/funceme/services/fetch-funceme-measures.js";
// Domain Model

describe("Fetch Equipments", () => {
  const ftpClientAdapter = new FTPClientAdapterMock();
  let meteorologicalOrganRepositoryInMemory;

  beforeEach(() => {
    jest.useFakeTimers("modern");

    meteorologicalOrganRepositoryInMemory =
      new MetereologicalOrganRepositoryInMemory();
  });

  afterEach(() => {
    jest.useRealTimers();
    jest.resetAllMocks();
    jest.restoreAllMocks();
  });

  test("Should be able to fetch equipments measurements and save only measurements from already registered equipment", async () => {
    jest.setSystemTime(new Date(2023, 9, 2));

    jest
      .spyOn(ftpClientAdapter, "getFolderContentDescription")
      .mockImplementation(async (folder) => {
        return new Promise((resolve, reject) => {
          if (folder === "pcds") {
            return resolve([{ name: "stn_data_2023.tar.gz" }]);
          }

          return resolve([{ name: "prec_data_2023.tar.gz" }]);
        });
      });

    const meteorologicalOrganRepositoryInMemory =
      new MetereologicalOrganRepositoryInMemory();

    const fetchFuncemeEquipments = new FetchFuncemeEquipments(
      ftpClientAdapter,
      meteorologicalOrganRepositoryInMemory
    );

    const equipments = [
      {
        Id: 1696215600000,
        Code: "A354",
        Name: "OEIRAS",
        Altitude: "154.03",
        Location: { Latitude: "-6.974135", Longitude: "-42.146831" },
        Type: 1,
        Organ: "FUNCEME",
        Id_Organ: 1,
        Enabled: false,
      },
      {
        Id: 1696215600000,
        Code: "B8531C1C",
        Name: "Quixerê",
        Altitude: "132.0",
        Location: {
          Latitude: "-5.0838888888889",
          Longitude: "-37.856666666666996",
        },
        Type: 1,
        Organ: "FUNCEME",
        Id_Organ: 1,
        Enabled: false,
      },
    ];

    const equipmentsRepository = new MetereologicalEquipmentRepositoryInMemory(
      equipments
    );

    const fetchMeasures = new FetchEquipmentsMeasures(
      fetchFuncemeEquipments,
      equipmentsRepository
    );

    const result = await fetchMeasures.execute(new EquipmentCommand());

    expect(equipmentsRepository.stationsReads).toHaveLength(2);

    expect(equipmentsRepository.stationsReads).toMatchObject([
      {
        Time: "2023-10-01",
        FK_Equipment: 1696215600000,
        FK_Organ: 1,
      },
      {
        Time: "2023-10-01",
        FK_Equipment: 1696215600000,
        FK_Organ: 1,
      },
    ]);

    expect(result.isSuccess()).toBeTruthy();
    expect(result.value()).toBe("Sucesso ao salvar medições de equipamentos");
  });
  test("Given that equipments measurements already persisted then should be able to update measurements", async () => {
    jest.setSystemTime(new Date(2023, 9, 2));

    jest
      .spyOn(ftpClientAdapter, "getFolderContentDescription")
      .mockImplementation(async (folder) => {
        return new Promise((resolve, reject) => {
          if (folder === "pcds") {
            return resolve([{ name: "stn_data_2023.tar.gz" }]);
          }

          return resolve([{ name: "prec_data_2023.tar.gz" }]);
        });
      });

    const meteorologicalOrganRepositoryInMemory =
      new MetereologicalOrganRepositoryInMemory();

    const fetchFuncemeEquipments = new FetchFuncemeEquipments(
      ftpClientAdapter,
      meteorologicalOrganRepositoryInMemory
    );

    const stationsMeasurements = [
      {
        TotalRadiation: null,
        MaxRelativeHumidity: 33.21,
        MinRelativeHumidity: 26.83,
        AverageRelativeHumidity: 30.04,
        MaxAtmosphericTemperature: 31.65,
        MinAtmosphericTemperature: 29.08,
        AverageAtmosphericTemperature: 30.23,
        AtmosphericPressure: 992.46,
        WindVelocity: 99.72,
        Et0: null,
        Time: "2023-10-01",
        FK_Equipment: 1696215600000,
        FK_Organ: 1,
      },
      {
        TotalRadiation: 335.35,
        MaxRelativeHumidity: 64.22,
        MinRelativeHumidity: 58.32,
        AverageRelativeHumidity: 60.61,
        MaxAtmosphericTemperature: 29.45,
        MinAtmosphericTemperature: 27.79,
        AverageAtmosphericTemperature: 28.61,
        AtmosphericPressure: 994.6,
        WindVelocity: 3.42,
        Et0: 6.354057931957724,
        Time: "2023-10-01",
        FK_Equipment: 1696215630000,
        FK_Organ: 1,
      },
    ];

    const pluviometersMeasurements = [
      {
        Value: 0,
        Time: "2023-10-01",
        FK_Equipment: 1994225630000,
        FK_Organ: 1,
      },
    ];

    const equipments = [
      {
        Id: 1696215600000,
        Code: "A354",
        Name: "OEIRAS",
        Altitude: "154.03",
        Location: { Latitude: "-6.974135", Longitude: "-42.146831" },
        Type: 1,
        Organ: "FUNCEME",
        Id_Organ: 1,
        Enabled: false,
      },
      {
        Id: 1696215630000,
        Code: "B8531C1C",
        Name: "Quixerê",
        Altitude: "132.0",
        Location: {
          Latitude: "-5.0838888888889",
          Longitude: "-37.856666666666996",
        },
        Type: 1,
        Organ: "FUNCEME",
        Id_Organ: 1,
        Enabled: false,
      },
      {
        Id: 1994225630000,
        Code: "24116",
        Name: "SOLONOPOLE",
        Altitude: null,
        Location: {
          Latitude: "-5.73369444444",
          Longitude: "-39.0069444444",
        },
        Type: 2,
        Organ: "FUNCEME",
        Id_Organ: 1,
        Enabled: false,
      },
    ];

    const equipmentsRepository = new MetereologicalEquipmentRepositoryInMemory(
      equipments,
      stationsMeasurements,
      pluviometersMeasurements
    );

    const updateStationsMeasurementSpy = jest.spyOn(
      equipmentsRepository,
      "updateStationsMeasurements"
    );
    const updatePluviometersMeasurementSpy = jest.spyOn(
      equipmentsRepository,
      "updatePluviometersMeasurements"
    );

    const fetchMeasures = new FetchEquipmentsMeasures(
      fetchFuncemeEquipments,
      equipmentsRepository
    );

    const result = await fetchMeasures.execute(new EquipmentCommand());

    expect(equipmentsRepository.stationsReads).toHaveLength(2);

    expect(equipmentsRepository.stationsReads).toStrictEqual(
      stationsMeasurements
    );

    expect(updateStationsMeasurementSpy).toHaveBeenCalled();
    expect(updatePluviometersMeasurementSpy).toHaveBeenCalled();

    expect(result.isSuccess()).toBeTruthy();
    expect(result.value()).toBe("Sucesso ao salvar medições de equipamentos");
  });
});
