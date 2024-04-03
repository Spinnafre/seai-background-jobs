// npm run test:dev -i __tests__/units/domain/eto/eto-calc.spec.js
import { describe, expect, test } from "@jest/globals";
import { CalcEto } from "../../../src/modules/calc-eto/domain/calc-eto.js";

describe("ET0 calc", () => {
  test("Should be able to calc ET0 when atmospheric pressure not exists", () => {
    const maxRelativeHumidity = 100;
    const minRelativeHumidity = 80;

    const maxAtmosphericTemperature = 27;
    const minAtmosphericTemperature = 24.1;
    const averageAtmosphericTemperature =
      (maxAtmosphericTemperature + minAtmosphericTemperature) / 2;

    // Coleta de dados de 1 dia 27/02
    // Dados Arredondados SIMIC (Saída SIMIC = 1.7, Saída Programa = 1.71)

    const eto = CalcEto({
      date: new Date("2024-02-27"),
      measures: {
        altitude: 30.4,
        longitude: -38.557368, // useLess
        latitude: -3.79512699,
        sunQuantityHoursInDay: 11, // useLess
        averageAtmosphericTemperature,
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

    expect(eto).toBeCloseTo(1.71, 1);
  });
  test("Should be able to calc ET0 when all measurements exists", () => {
    const maxRelativeHumidity = 99.7;
    const minRelativeHumidity = 85.7;

    const maxAtmosphericTemperature = 27.44;
    const minAtmosphericTemperature = 23.58;

    const averageAtmosphericTemperature =
      (maxAtmosphericTemperature + minAtmosphericTemperature) / 2;

    const eto = CalcEto({
      date: new Date("2024-02-27"),
      measures: {
        altitude: 30.4,
        longitude: -38.557368, // useLess
        latitude: -3.79512699,
        sunQuantityHoursInDay: 11, // useLess
        averageAtmosphericTemperature,
        minAtmosphericTemperature,
        maxAtmosphericTemperature,
        averageRelativeHumidity:
          (maxRelativeHumidity + minRelativeHumidity) / 2,
        maxRelativeHumidity,
        minRelativeHumidity,
        atmosphericPressure: 100.814,
        totalRadiation: 83.33,
        windVelocity: 1.07,
      },
    });

    expect(eto).toBeCloseTo(1.66, 1);
  });
});
