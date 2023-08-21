/* 
  Considerar que os dados de medição estão certos na planilha
  Casar as horas de medição com o progrmada
  Dados que pode ser cálculados a qualquer hora, podem ser independentes
*/

import { ServiceProtocol } from "../../scrapper/core/service-protocol";

/*
  z:(Altura do anemometro em m)
  uz:(Velocidade do vento)
*/
export function dataAdjust(
  radiation,
  temperatureAverage,
  humidityAverage,
  altitude
  // windVelocity = null, // antes era "uz"
) {
  // Pressão utilizando a altitude local
  const pressure = 101.3 * ((293 - 0.0095 * altitude) / 293) ** 5.23;

  // Radiação precisa estar em Mj/wh (multiplicar por 24 e por 0.0036)
  const solarRadiation = radiation * 0.0036 * 24;

  // Aproximação para a velocidade do vento, se n tiver dado, considerar 2m/s
  let windVelocity = 2;
  // if (windVelocity === null) {
  //   // z = 2;
  //   windVelocity = 2;
  // }

  return {
    pressure,
    solarRadiation,
    temperatureAverage,
    humidityAverage,
    windVelocity,
  };
}
/*
  rhmed - umidade média
  tmed - temperatura média
  press - pressão atmosférica local
*/
export function etoPrecalc(temperatureAverage, humidityAverage, pressure) {
  // Cálculo da pressão de vapor de saturação atual  (e0t)
  const saturationSteamPressure =
    0.6108 *
    Math.exp((17.27 * temperatureAverage) / (temperatureAverage + 237.3));

  // Verificar sobre a estimativa para umidade do ar
  const currentSteamPressureValue =
    (humidityAverage / 100) * saturationSteamPressure; // Pressão de vapor atual (ea)

  /*
    Cálculo do Delta (Inclinação da curva entre pressão de vapor de saturação e temperatura)
    pelo documento de referência, a diferença é muito pequena
  */
  const delta =
    (2503 *
      Math.exp((17.27 * temperatureAverage) / (temperatureAverage + 237.3))) /
    (temperatureAverage + 237.3) ** 2;

  // Gama pelo documento
  const gama = 0.000665 * pressure;

  return {
    saturationSteamPressure,
    currentSteamPressureValue,
    delta,
    gama,
  };
}

export function sunCalc(julianDay, solarRadiationTotal, altitude, temperatureAverage) {
  const SOLAR_CONSTANT = 4.92;

  const PI = Math.PI;
  const PHI = (-4.19 * PI) / 180;

  // The constant 365 in Eqs. is held at 365 even during a leap year.
  const solarDeclination =
    0.409 * Math.sin(((2 * PI) / 365) * julianDay - 1.39); // Declinação solar no dia "J"

  const distanceBetweenEarthAndSun =
    1 + 0.033 * Math.cos((2 * PI * julianDay) / 365); // Correção distância sol-terra

  // The sunset hour angle
  const omega_s = Math.acos(-Math.tan(PHI) * Math.tan(solarDeclination));

  // Máximo de horas de sol em um dia
  const sunMaxDailyHours = (24 / PI) * omega_s; // ou N

  console.log("sunMaxDailyHours ::: ", sunMaxDailyHours);

  const sinq =
    omega_s * Math.sin(PHI) * Math.sin(solarDeclination) +
    Math.sin(omega_s) * Math.sin(PHI) * Math.sin(solarDeclination);

  // radiação extraterrestre
  const extraterrestrialRadiation =
    (sinq * 24 * SOLAR_CONSTANT * distanceBetweenEarthAndSun) / PI;

  //Boa aproximação!!
  const Rs_teste =
    (0.25 + (0.5 * 11) / sunMaxDailyHours) * extraterrestrialRadiation;

  console.log(Rs_teste);

  //Para dados diários, é necessário estimar a temperatura máxima e mínima

  /*
      For 'interior' locations, defined as where the local land massa dominates 
      and air masses are not strongly influenced by a large water body, k = 0.16

      For 'coastal' locations, suited on or adjacent to teh cosast of a large
      land mass and where the air masses are influenced by a nearby water body
      k = 0.19
    */

  const k_rs = 0.19; // Coeficiente de ajuste empírico

  const thermal_diff =
    (solarRadiationTotal / (k_rs * extraterrestrialRadiation)) ** 2; //amplitude térmica

  const maxTemperature = temperatureAverage + thermal_diff / 2;
  const minTemperature = temperatureAverage - thermal_diff / 2;

  /*
      For purposes of calculating Rn, hourly Rso can be calculated using the following
      simple approach:
    */

  const clearSkyRadiation =
    (0.75 + altitude * 2 * 10 ** -5) * extraterrestrialRadiation; // radiação de céu limpo

  /*
      The ratio Rs/Rso in Eq. 45 represents relative cloudiness and is limited to 0.3 < Rs/Rso
    ≤ 1.0 so that fcd has limits of 0.05 ≤ fcd ≤ 1.0. 
    */

  let div = solarRadiationTotal / clearSkyRadiation;

  if (div < 0.3) {
    div = 0.3;
  } else if (div > 1) {
    div = 1;
  }

  const nebulosityFactor = 1.35 * div - 0.35; // fator nebulosidade

  return {
    extraterrestrialRadiation,
    clearSkyRadiation,
    nebulosityFactor,
    maxTemperature,
    minTemperature,
  };
}
/*
  rs - radiação solar total
  ea - pressão vapor atual
 */
export function radCalc(
  maxTemperature,
  minTemperature,
  solarRadiationTotal,
  nebulosityFactor,
  currentSteamPressureValue,
  windVelocity,
  gama
) {
  const CULTURE_REFLECTION = 0.23;
  const sigma = 4.901 * Math.pow(10, -9); // Constante de Steffan-Boltzman (Modificado)

  // Saldo líquido de radiação de ondas curtas
  const shortWaveRadiation = solarRadiationTotal * (1 - CULTURE_REFLECTION);

  const MaxTemperatureAbsolute = maxTemperature + 273.16;
  const MinTemperatureAbsolute = minTemperature + 273.16;

  /*
      Net outgoing long-wave radiation, [MJ m-2 h-1] (defined as being
      positive, upwards and negative downwards)
    */
  const longWaveRadiation =
    sigma *
    ((MaxTemperatureAbsolute ** 4 + MinTemperatureAbsolute ** 4) / 2) *
    (0.34 - 0.14 * Math.sqrt(currentSteamPressureValue)) *
    nebulosityFactor; // radiação de ondas longas

  const liquidRad = shortWaveRadiation - longWaveRadiation; // radiação líquida

  /// Fluxo de calor do solo
  /*
      The magnitude of the daily, weekly or ten-day soil heat flux density, G, beneath a
      fully vegetated grass or alfalfa reference surface is relatively small in comparison
      with Rn. Therefore, it is ignored so that:
    */
  const flowDensity = 0; // densidade de fluxo de calor na superfície do solo

  const r_s = 70.72;

  const r_a = windVelocity < 0.5 ? 208 / 0.5 : 208 / windVelocity;

  //Fator da planilha
  //Assume que o vento no mínimo seria 0.5 m/s (Colocar como cadastro?)

  //Produto com gama no denominador
  const g_asterico = gama * (1 + r_s / r_a);

  return {
    liquidRad,
    flowDensity,
    g_asterico,
  };
}

export class CalcETO extends ServiceProtocol {
  constructor(equipmentRepository, etoRepository, stationReadsRepository) {
    this.equipmentRepository = equipmentRepository
    this.stationReadsRepository = stationReadsRepository
    this.etoRepository = etoRepository
  }

  async execute(date) {
    console.log("date ::: ", date)
    const stationsEqps = await this.equipmentRepository.getStations()
    const year = 2023;
    const day = 17;
    const julianDay = day - year + 1;

    const stationsEto = []

    for (const station of stationsEqps) {
      // buscar leituras da estação usando o Fk_Equipment
      const stationReads = await this.stationReadsRepository.getStationReadsByEquipment(station.id)

      // e se não tiver dados de leituras da estação?
      if (stationReads === null) {
        console.log("Station is empty")
        continue
      }

      const altitude = station.altitude;

      stationReads.forEach((stationRead) => {
        const { idRead,atmosphericTemperature, totalRadiation, relativeHumidity } = stationRead

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

        const rad = (0.408 * delta * (liquidRad - flowDensity)) / (delta + g_asterico);

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
          eto
        })
      })
    }

    console.log("Salvando dados de ETO...")
    await this.etoRepository.add(stationsEto)

  }
}