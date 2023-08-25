// npm run test:dev -i __tests__/units/domain/eto/eto-calc.spec.js
import { describe, expect, test } from "@jest/globals";
import { CalcEto } from "../../../../src/jobs/calc_eto/domain/calc-eto.js";

describe("ET0 calc", () => {
  test("Should be able to calc ET0 ", () => {
    const altitude = 35;
    const atmosphericTemperatureAverage = 3;
    const totalRadiationAverage = null;
    const relativeHumidityAverage = 2;
    // const windVelocity = 4;

    const eto = CalcEto({
      date: {
        year: 2023,
        day: 25,
      },
      altitude,
      atmosphericTemperatureAverage,
      relativeHumidityAverage,
      totalRadiationAverage,
      sunQuantityHoursInDay: 11,
    });

    console.log("ETO = ", eto);

    expect(eto).toBe(0.6622928902574112);
  });
});
