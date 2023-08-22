import { ServiceProtocol } from "../../scrapper/core/service-protocol.js";

import { dataAdjust } from "../helpers/data-adjust.js";

import { etoPrecalc, radCalc, sunCalc } from "../domain";

export class CalcETO extends ServiceProtocol {
  constructor(equipmentRepository, etoRepository, stationReadsRepository) {
    this.equipmentRepository = equipmentRepository;
    this.stationReadsRepository = stationReadsRepository;
    this.etoRepository = etoRepository;
  }

  async execute(date) {
    console.log("date ::: ", date);
    const stationsEqps = await this.equipmentRepository.getStations();
    const year = 2023;
    const day = 17;
    const julianDay = day - year + 1;

    const stationsEto = [];

    for (const station of stationsEqps) {
      // buscar leituras da estação usando o Fk_Equipment
      const stationReads =
        await this.stationReadsRepository.getStationReadsByEquipment(
          station.id
        );

      // e se não tiver dados de leituras da estação?
      if (stationReads === null) {
        console.log("Station is empty");
        continue;
      }

      const altitude = station.altitude;

      stationReads.forEach((stationRead) => {
        const {
          idRead,
          atmosphericTemperature,
          totalRadiation,
          relativeHumidity,
        } = stationRead;

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

        const {
          currentSteamPressureValue,
          delta,
          gama,
          saturationSteamPressure,
        } = etoPrecalc(temperatureAverage, humidityAverage, pressure);

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

        const rad =
          (0.408 * delta * (liquidRad - flowDensity)) / (delta + g_asterico);

        console.log("[LOG] radiation = ", rad);

        const aero =
          (gama *
            (900 / (273 + temperatureAverage)) *
            windVelocity *
            (saturationSteamPressure - currentSteamPressureValue)) /
          (delta + g_asterico);

        console.log("[LOG] aero = ", aero);

        const et0 = rad + aero;

        console.log("[LOG] eto = ", et0);

        stationsEto.push({
          idRead,
          eto,
        });
      });
    }

    console.log("Salvando dados de ETO...");
    await this.etoRepository.add(stationsEto);
  }
}
