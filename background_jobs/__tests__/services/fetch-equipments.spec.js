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

    const equipmentsRepository =
      new MetereologicalEquipmentRepositoryInMemory();

    const fetchEquipments = new FetchEquipments(
      fetchFuncemeEquipments,
      equipmentsRepository
    );

    await fetchEquipments.execute(command);
  });
});
