import {
  AdjustSolarRadiation,
  CalcAero,
  CalcClearSkyRadiation,
  CalcExtraterrestrialRadiation,
  CalcFlowHeatSoil,
  CalcGAsterico,
  CalcGama,
  CalcInclinationBetweenSteamPressureAndTemperature,
  CalcLiquidRadiation,
  CalcMaxAndMinTemperature,
  CalcNebulosityFactor,
  CalcRadiation,
  CalcSteamPressureEstimation,
  CalcSteamPressureWithAverageMeasures,
  CalcSunsetHourAngle,
  EstimateSolarRadiation,
} from "./calc-functions.js";

export function CalcEto({
  date,
  altitude,
  atmosphericTemperatureAverage,
  totalRadiationAverage,
  relativeHumidityAverage,
  sunQuantityHoursInDay,
}) {
  // Dá para usar a altitude como constante, só q tem q saber se é 10 metros ou 2 metros
  // const z = 2 // Altura do anemometro em m
  const year = date.year;
  const day = date.day;

  const julianDay = day - year + 1;

  const PHI = (-4.19 * Math.PI) / 180;

  const solarDeclination =
    0.409 * Math.sin(((2 * Math.PI) / 365) * julianDay - 1.39); // Declinação solar no dia "J"

  // The sunset hour angle
  const omega_s = CalcSunsetHourAngle(PHI, solarDeclination);

  const extraterrestrialRadiation = CalcExtraterrestrialRadiation(
    PHI,
    solarDeclination,
    omega_s,
    julianDay
  );

  // adjust solar radiation
  // Radiação precisa estar em Mj/wh (multiplicar por 24 e por 0.0036)
  const solarRadiation = totalRadiationAverage
    ? AdjustSolarRadiation(totalRadiationAverage)
    : EstimateSolarRadiation(
        omega_s,
        extraterrestrialRadiation,
        sunQuantityHoursInDay
      );

  const windVelocity = 2;

  const clearSkyRadiation = CalcClearSkyRadiation(
    altitude,
    extraterrestrialRadiation
  ); // radiação de céu limpo

  const { maxTemperature, minTemperature } = CalcMaxAndMinTemperature(
    solarRadiation,
    extraterrestrialRadiation,
    atmosphericTemperatureAverage
  );

  const nebulosityFactor = CalcNebulosityFactor(
    solarRadiation,
    clearSkyRadiation
  );
  // calc pressure
  // will alway be estimated
  const atmosphericPressure = 101.3 * ((293 - 0.0095 * altitude) / 293) ** 5.23; // Pressão utilizando a altitude local

  const { currentSteamPressureValue, saturationSteamPressure } =
    relativeHumidityAverage
      ? CalcSteamPressureWithAverageMeasures(
          atmosphericTemperatureAverage,
          relativeHumidityAverage
        )
      : CalcSteamPressureEstimation(minTemperature);

  const gama = CalcGama(atmosphericPressure);

  const delta = CalcInclinationBetweenSteamPressureAndTemperature(
    atmosphericTemperatureAverage
  );

  const flowDensity = CalcFlowHeatSoil();
  const g_asterico = CalcGAsterico(gama, windVelocity);

  const liquidRad = CalcLiquidRadiation(
    solarRadiation,
    maxTemperature,
    minTemperature,
    currentSteamPressureValue,
    nebulosityFactor
  );

  const aero = CalcAero(
    gama,
    delta,
    g_asterico,
    atmosphericTemperatureAverage,
    windVelocity,
    saturationSteamPressure,
    currentSteamPressureValue
  );

  const rad = CalcRadiation(delta, liquidRad, flowDensity, g_asterico);

  const et0 = aero + rad;

  return et0;
}
