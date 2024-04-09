// npm run test:dev -i __tests__/services/fetch-equipments.spec.js

import {
  afterAll,
  afterEach,
  beforeAll,
  beforeEach,
  describe,
  expect,
  jest,
  test,
} from "@jest/globals";

import "dotenv/config.js";

import { MetereologicalEquipmentRepository } from "../../data/database/repositories/equipment.js";
import { connections } from "../../data/database/connection.js";

describe.skip("Equipment Repository", () => {
  const repository = new MetereologicalEquipmentRepository();

  afterAll(async () => {
    await connections.equipments.destroy();
  });
  beforeEach(async () => {
    await connections.equipments.raw(
      `TRUNCATE TABLE public."MetereologicalEquipment" RESTART IDENTITY CASCADE;`
    );
  });

  afterEach(async () => {
    await connections.equipments.raw(
      `TRUNCATE TABLE public."MetereologicalEquipment" RESTART IDENTITY CASCADE;`
    );
  });
  test("should be able to save equipments", async () => {
    const stations = [
      {
        IdEquipmentExternal: "A354",
        Name: "OEIRAS",
        Altitude: "154.03",
        Location: {
          Latitude: "-6.974135",
          Longitude: "-42.146831",
        },
        FK_Type: 1,
        FK_Organ: 1,
        Enabled: false,
      },
      {
        IdEquipmentExternal: "B8522B7C",
        Name: "São Gonçalo do Amarante - Jardim Botânico",
        Altitude: "25.0",
        Location: {
          Latitude: "-3.57055",
          Longitude: "-38.886972222222205",
        },
        FK_Type: 1,
        FK_Organ: 1,
        Enabled: false,
      },
    ];

    await repository.create(stations);

    const eqps = await repository.getEquipments({
      eqpType: "station",
    });

    expect(eqps).toStrictEqual([
      {
        Id: 1,
        Code: "A354",
        Location: [-6.974135, -42.146831],
        Altitude: 154.03,
        Type: "station",
        Organ: "INMET",
        Id_Organ: 1,
      },
      {
        Id: 2,
        Code: "B8522B7C",
        Location: [-3.57055, -38.886972222],
        Altitude: 25,
        Type: "station",
        Organ: "INMET",
        Id_Organ: 1,
      },
    ]);
  });
});
