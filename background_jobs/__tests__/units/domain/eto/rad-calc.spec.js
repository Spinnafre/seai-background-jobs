import {
  describe,
  expect,
  test,
  jest,
  afterEach,
  beforeEach,
} from "@jest/globals";

import {radCalc,etoPrecalc,sunCalc} from '../../../../src/jobs/calc_eto/domain/index.js'
import {dataAdjust} from '../../../../src/jobs/calc_eto/helpers/data-adjust.js'
describe("Radiation calc", () => {
    test("Should be able to calc radiation",()=>{          
          const date = new Date();
          console.log(date.toISOString());
          // Dá para usar a altitude como constante, só q tem q saber se é 10 metros ou 2 metros
          // const z = 2 // Altura do anemometro em m
          const altitude = 35;
          const atmosphericTemperature = 3;
          const totalRadiation = 2;
          const relativeHumidity = 2;
          // const windVelocity = 4;
          
          const year = 2023;
          const day = 17;
          const julianDay = day - year + 1;
          
          const {
            pressure,
            solarRadiation,
            temperatureAverage,
            humidityAverage,
            windVelocity,
          } = dataAdjust(
            totalRadiation,
            atmosphericTemperature,
            relativeHumidity,
            altitude
          );
          
          console.log("[LOG] result of [dataAdjust] = ", {
            pressure,
            solarRadiation,
            temperatureAverage,
            humidityAverage,
            windVelocity,
          });
          
          const {
            extraterrestrialRadiation,
            clearSkyRadiation,
            nebulosityFactor,
            maxTemperature,
            minTemperature,
          } = sunCalc(julianDay, solarRadiation, altitude, temperatureAverage);
          
          console.log("[LOG] result of [sunCalc] = ", {
            extraterrestrialRadiation,
            clearSkyRadiation,
            nebulosityFactor,
            maxTemperature,
            minTemperature,
          });
          
          const { currentSteamPressureValue, delta, gama, saturationSteamPressure } =
            etoPrecalc(temperatureAverage, humidityAverage, pressure);
          
          console.log("[LOG] result of [etoPrecalc] = ", {
            currentSteamPressureValue,
            delta,
            gama,
            saturationSteamPressure,
          });
          
          const { flowDensity, g_asterico, liquidRad } = radCalc(
            maxTemperature,
            minTemperature,
            solarRadiation,
            nebulosityFactor,
            currentSteamPressureValue,
            windVelocity,
            gama
          );

          console.log("[LOG] result of [radCalc] = ", {
            flowDensity,
            g_asterico,
            liquidRad,
          });
          
    })
});