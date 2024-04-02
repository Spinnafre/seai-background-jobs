// npm run test:dev -i __tests__/units/domain/eto/eto-calc.spec.js
import { describe, expect, test } from "@jest/globals";
import { CalcEto } from "../../../src/modules/calc-eto/domain/calc-eto.js";

describe("ET0 calc", () => {
  test("Should be able to calc ET0 when date is 27/2023", () => {
    const maxRelativeHumidity = 100;
    const minRelativeHumidity = 80;

    const maxAtmosphericTemperature = 27.0;
    const minAtmosphericTemperature = 24.1;

    const eto = CalcEto({
      date: {
        year: 2024,
        month: 2,
        day: 27,
      },
      measures: {
        altitude: 30.4,
        longitude: -38.557368, // useLess
        latitude: -3.79512699,
        sunQuantityHoursInDay: 11, // useLess
        averageAtmosphericTemperature:
          maxAtmosphericTemperature / minAtmosphericTemperature / 2,
        minAtmosphericTemperature,
        maxAtmosphericTemperature,
        averageRelativeHumidity:
          (maxRelativeHumidity + minRelativeHumidity) / 2,
        maxRelativeHumidity,
        minRelativeHumidity,
        atmosphericPressure: null,
        totalRadiation: 83.33,
        windVelocity: 1.07,
      },
    });

    expect(eto).toBe(1.71);
  });
});
