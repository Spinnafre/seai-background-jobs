// npm run test:dev -i __tests__/services/fetch-equipments.spec.js

import {
  afterEach,
  beforeEach,
  describe,
  expect,
  jest,
  test,
} from "@jest/globals";

import "dotenv/config.js";

import { MetereologicalEquipmentRepository } from "../../src/shared/database/repositories/Equipment";
import { connections } from "../../src/shared/database/connection.js";

function prepareMeasurementsToPersist(equipments = [], ids) {
  const measures = [];

  equipments.forEach((station) => {
    station.Measurements.FK_Equipment = ids.get(station.IdEquipmentExternal);
    station.Measurements.FK_Organ = station.FK_Organ;

    measures.push(station.Measurements);
  });

  return measures;
}

describe("Equipment Repository", () => {
  test("should be able to save equipments", async () => {
    await connections.equipments.raw(
      `TRUNCATE TABLE public."MetereologicalEquipment" RESTART IDENTITY CASCADE;`
    );
    const stations = [
      {
        IdEquipmentExternal: "A354",
        Name: "OEIRAS",
        Altitude: "154.03",
        Location: ["-6.974135", "-42.146831"],
        FK_Type: 1,
        FK_Organ: 1,
        Enabled: false,
        Measurements: {
          TotalRadiation: null,
          MaxRelativeHumidity: 33.21,
          MinRelativeHumidity: 26.83,
          AverageRelativeHumidity: 30.04,
          MaxAtmosphericTemperature: 31.65,
          MinAtmosphericTemperature: 29.08,
          AverageAtmosphericTemperature: 30.23,
          AtmosphericPressure: 992.46,
          WindVelocity: 99.72,
          Et0: 14,
          Time: "2023-10-01",
          Hour: null,
        },
      },
      {
        IdEquipmentExternal: "B8522B7C",
        Name: "São Gonçalo do Amarante - Jardim Botânico",
        Altitude: "25.0",
        Location: ["-3.57055", "-38.886972222222205"],
        FK_Type: 1,
        FK_Organ: 1,
        Enabled: false,
        Measurements: {
          TotalRadiation: 278.82,
          MaxRelativeHumidity: 73.18,
          MinRelativeHumidity: 67.45,
          AverageRelativeHumidity: 70.51,
          MaxAtmosphericTemperature: 28.7,
          MinAtmosphericTemperature: 27.64,
          AverageAtmosphericTemperature: 28.19,
          AtmosphericPressure: 1007.24,
          WindVelocity: 4.14,
          Et0: 14,
          Time: "2023-10-01",
          Hour: null,
        },
      },
    ];

    const repository = new MetereologicalEquipmentRepository();

    const eqps = await repository.create(stations);

    const measures = prepareMeasurementsToPersist(stations, eqps);

    await repository.insertStationsMeasurements(measures);

    await connections.equipments.raw(
      `TRUNCATE TABLE public."MetereologicalEquipment" RESTART IDENTITY CASCADE;`
    );

    await connections.equipments.destroy();
  });
});
