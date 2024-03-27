// npm run test:dev -i __tests__/units/services/funceme/fetch-funceme-stations-measures.spec.js

import {
  afterEach,
  beforeEach,
  describe,
  expect,
  jest,
  test,
} from "@jest/globals";
import { MetereologicalOrganRepositoryInMemory } from "../doubles/infra/repositories/inMemory/mtereologicalOrganRepository.js";
import { FTPClientAdapterMock } from "../doubles/infra/services/ftp/ftp-stub.js";

import { MetereologicalEquipmentRepositoryInMemory } from "../doubles/infra/repositories/inMemory/metereologicalEquipment.js";
import { FetchFuncemeEquipments } from "../../src/modules/equipments/funceme/services/fetch-funceme-measures.js";
import { FetchEquipmentCommand } from "../../src/modules/equipments/command.js";
import { FetchEquipments } from "../../src/modules/equipments/fetch-equipments-facade.js";
// Domain Model

describe("Fetch Equipments", () => {
  beforeEach(() => {
    jest.useFakeTimers("modern");
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  test("should be able to fetch equipments", async () => {
    jest.setSystemTime(new Date(2023, 9, 2));

    const command = new FetchEquipmentCommand();

    const ftpClientAdapter = new FTPClientAdapterMock();

    const meteorologicalOrganRepositoryInMemory =
      new MetereologicalOrganRepositoryInMemory();

    const fetchFuncemeEquipments = new FetchFuncemeEquipments(
      ftpClientAdapter,
      meteorologicalOrganRepositoryInMemory
    );

    const dataOrError = await fetchFuncemeEquipments.execute(command);

    expect(dataOrError.isSuccess()).toBeTruthy();

    const { stations, pluviometers } = dataOrError.value();

    expect(stations.length).toBeGreaterThan(0);
    expect(pluviometers.length).toBeGreaterThan(0);
  });

  test("should be able to save equipments", async () => {
    jest.setSystemTime(new Date(2023, 9, 2));

    const command = new FetchEquipmentCommand();

    const ftpClientAdapter = new FTPClientAdapterMock();

    const meteorologicalOrganRepositoryInMemory =
      new MetereologicalOrganRepositoryInMemory();

    const fetchFuncemeEquipments = new FetchFuncemeEquipments(
      ftpClientAdapter,
      meteorologicalOrganRepositoryInMemory
    );

    const equipments = [
      {
        IdEquipment: 1,
        IdEquipmentExternal: "A354",
        Name: "",
        Altitude: "154.03",
        Type: 1,
        Organ: 1,
        Organ_Id: 1,
      },
      {
        IdEquipment: 2,
        IdEquipmentExternal: "A342",
        Location: "",
        Name: "",
        Altitude: "298.19",
        Type: 1,
        Organ: 1,
        Organ_Id: 1,
      },
      {
        IdEquipment: 3,
        IdEquipmentExternal: "A342",
        Location: "",
        Name: "",
        Altitude: "132.0",
        Type: 1,
        Organ: 1,
        Organ_Id: 1,
      },
    ];

    const equipmentsRepository = new MetereologicalEquipmentRepositoryInMemory(
      equipments
    );

    const fetchEquipments = new FetchEquipments(
      fetchFuncemeEquipments,
      equipmentsRepository
    );

    const result = await fetchEquipments.execute(command);

    expect(result.isSuccess()).toBeTruthy();
    expect(result.value()).toBe("Sucesso ao carregar equipamentos e medições");

    expect(equipmentsRepository.stationsReads.length).toBeGreaterThan(0);
    console.log(equipmentsRepository.pluviometersReads);
    // expect(equipmentsRepository.pluviometersReads.length).toBeGreaterThan(0);
  });
});
