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
  CalcMaxAndMinTemperatureEstimation,
  CalcNebulosityFactor,
  CalcRadiation,
  CalcSteamPressureEstimation,
  CalcSteamPressureWithAverageMeasures,
  CalcSunsetHourAngle,
  EstimateSolarRadiation,
} from "./calc-functions.js";

export function CalcEto(
  { date, measures } = {
    date: {},
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
  }
) {
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
  const solarRadiation = measures.totalRadiation
    ? AdjustSolarRadiation(measures.totalRadiation)
    : EstimateSolarRadiation(
        omega_s,
        extraterrestrialRadiation,
        measures.sunQuantityHoursInDay
      );

  const windVelocity = measures.windVelocity || 2;

  const clearSkyRadiation = CalcClearSkyRadiation(
    measures.altitude,
    extraterrestrialRadiation
  ); // radiação de céu limpo

  let minAtmosphericTemperature = null;
  let maxAtmosphericTemperature = null;

  if (
    measures.minAtmosphericTemperature &&
    measures.maxAtmosphericTemperature
  ) {
    minAtmosphericTemperature = measures.minAtmosphericTemperature;
    maxAtmosphericTemperature = measures.maxAtmosphericTemperature;
  } else {
    console.log("Estimando temperatura máxima e mínima...");
    const { maxTemperature, minTemperature } =
      CalcMaxAndMinTemperatureEstimation(
        solarRadiation,
        extraterrestrialRadiation,
        measures.averageAtmosphericTemperature
      );

    minAtmosphericTemperature = minTemperature;
    maxAtmosphericTemperature = maxTemperature;
  }

  const nebulosityFactor = CalcNebulosityFactor(
    solarRadiation,
    clearSkyRadiation
  );

  const atmosphericPressure =
    measures.atmosphericPressure ||
    101.3 * ((293 - 0.0095 * measures.altitude) / 293) ** 5.23; // Pressão utilizando a altitude local

  const { currentSteamPressureValue, saturationSteamPressure } =
    measures.averageRelativeHumidity
      ? CalcSteamPressureWithAverageMeasures(
          measures.averageAtmosphericTemperature,
          measures.averageRelativeHumidity
        )
      : CalcSteamPressureEstimation(minAtmosphericTemperature);

  const gama = CalcGama(atmosphericPressure);

  const delta = CalcInclinationBetweenSteamPressureAndTemperature(
    measures.averageAtmosphericTemperature
  );

  const flowDensity = CalcFlowHeatSoil();
  const g_asterico = CalcGAsterico(gama, windVelocity);

  const liquidRad = CalcLiquidRadiation(
    solarRadiation,
    maxAtmosphericTemperature,
    minAtmosphericTemperature,
    currentSteamPressureValue,
    nebulosityFactor
  );

  const aero = CalcAero(
    gama,
    delta,
    g_asterico,
    measures.averageAtmosphericTemperature,
    windVelocity,
    saturationSteamPressure,
    currentSteamPressureValue
  );

  const rad = CalcRadiation(delta, liquidRad, flowDensity, g_asterico);

  const et0 = aero + rad;

  return et0;
}
