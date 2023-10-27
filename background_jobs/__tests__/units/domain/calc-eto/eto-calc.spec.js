// npm run test:dev -i __tests__/units/domain/eto/eto-calc.spec.js
import { describe, expect, test } from "@jest/globals";
import { CalcEto } from "../../../../src/modules/calc-eto/domain/calc-eto.js";

describe("ET0 calc", () => {
  test("Should be able to calc ET0 ", () => {

    const altitude = 35;
    const averageAtmosphericTemperature = 2;
    const minAtmosphericTemperature = 2;
    const maxAtmosphericTemperature = 2;
    const maxRelativeHumidity = 2;
    const minRelativeHumidity = null;
    const atmosphericPressure = 2;
    const totalRadiation = 2;
    const windVelocity = 21;
    const averageRelativeHumidity = 20;

    const eto = CalcEto({
      date: {
        year: 2023,
        day: 25
      },
      measures: {
        altitude,
        sunQuantityHoursInDay: 11,
        averageAtmosphericTemperature,
        minAtmosphericTemperature,
        maxAtmosphericTemperature,
        averageRelativeHumidity,
        maxRelativeHumidity,
        minRelativeHumidity,
        atmosphericPressure,
        totalRadiation,
        windVelocity,
      },
    });


    expect(eto).toBe(0.7369587085515771);
  });
});
