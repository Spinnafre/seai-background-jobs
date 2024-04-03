// npm run test:dev -i __tests__/units/services/funceme/fetch-funceme-stations-measures.spec.js

import {
  afterEach,
  beforeEach,
  describe,
  expect,
  jest,
  test,
} from "@jest/globals";

import { MetereologicalEquipmentRepositoryInMemory } from "../../../../../__tests__/doubles/infra/repositories/inMemory/metereologicalEquipment.js";
import { MetereologicalOrganRepositoryInMemory } from "../../../../../__tests__/doubles/infra/repositories/inMemory/mtereologicalOrganRepository.js";
import { FTPClientAdapterMock } from "../../../../../__tests__/doubles/infra/services/ftp/ftp-stub.js";

import { EquipmentCommand } from "../../services/commands/command.js";

import { FetchEquipmentsMeasures } from "../../services/measurements/fetch-measurements.js";

import { FetchFuncemeEquipments } from "../../data/funceme/services/fetch-funceme-measures.js";
// Domain Model

describe("Fetch Equipments", () => {
  const ftpClientAdapter = new FTPClientAdapterMock();
  let meteorologicalOrganRepositoryInMemory;

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

  beforeEach(() => {
    jest.useFakeTimers("modern");

    meteorologicalOrganRepositoryInMemory =
      new MetereologicalOrganRepositoryInMemory();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  test("should be able to fetch equipments measurements", async () => {
    jest.setSystemTime(new Date(2023, 9, 2));

    const meteorologicalOrganRepositoryInMemory =
      new MetereologicalOrganRepositoryInMemory();

    const fetchFuncemeEquipments = new FetchFuncemeEquipments(
      ftpClientAdapter,
      meteorologicalOrganRepositoryInMemory
    );

    const equipments = [
      {
        Id: 1696215600000,
        Code: "B8522B7C",
        Name: "São Gonçalo do Amarante - Jardim Botânico",
        Altitude: "25.0",
        Location: { Latitude: "-3.57055", Longitude: "-38.886972222222205" },
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

    expect(result.isSuccess()).toBeTruthy();
    expect(result.value()).toBe("Sucesso ao salvar medições de equipamentos");
  });
});
