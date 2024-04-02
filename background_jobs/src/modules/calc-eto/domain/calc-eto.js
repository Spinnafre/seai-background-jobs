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
  CalcSteamPressure,
  CalcSunsetHourAngle,
  EstimateSolarRadiation,
} from "./calc-aux-measures.js";

function calculateJulianDate(year, month, day) {
  if (month < 3) {
    year -= 1;
    month += 12;
  }

  const A = Math.floor(year / 100);
  const B = 2 - A + Math.floor(A / 4);
  const C = year > 0 ? 365.25 * year : 365.25 * year - 0.75;
  const E = 30.6001 * (month + 1);

  const JD = B + C + day + E + 1720994.5;
  return JD;
}

export function CalcEto(
  { date, measures } = {
    date: {
      year: null,
      day: null,
      month: null,
    },
    measures: {
      altitude,
      longitude,
      latitude,
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
  const year = date.year;
  const month = date.month;
  const day = date.day;

  // Example usage
  const gregorianDate = new Date(`${year}-${month}-${day}`);

  const julianDay = calculateJulianDate(
    gregorianDate.getUTCFullYear(),
    gregorianDate.getUTCMonth() + 1,
    gregorianDate.getUTCDate()
  );

  // const julianDay = day - year + 1;

  console.log("julianDay ", julianDay);

  const PHI = (measures.latitude * Math.PI) / 180;

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

  // Dá para usar a altitude como constante, só q tem q saber se é 10 metros ou 2 metros
  let anemometerHeight = measures.windVelocity ? 10 : 2; // Altura do anemometro em m

  // Aproximação para a velocidade do vento, se n tiver dado, considerar 2m/s
  let windVelocity = 2;

  //Corrigir pela altura do anemômetro
  if (measures.windVelocity) {
    windVelocity =
      (measures.windVelocity * 4.87) / Math.log(67.8 * anemometerHeight - 5.42);
  }

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

  // Pressão utilizando a altitude local
  const atmosphericPressure =
    measures.atmosphericPressure ||
    101.3 * ((293 - 0.0065 * measures.altitude) / 293) ** 5.26; // Pressão utilizando a altitude local

  // What if any measure not exists?
  const { currentSteamPressureValue, saturationSteamPressure } = [
    maxAtmosphericTemperature,
    minAtmosphericTemperature,
    measures.maxRelativeHumidity,
    measures.minRelativeHumidity,
  ].every((item) => item !== null)
    ? CalcSteamPressure({
        maxAtmosphericTemperature,
        minAtmosphericTemperature,
        maxRelativeHumidity: measures.maxRelativeHumidity,
        minRelativeHumidity: measures.minRelativeHumidity,
      })
    : CalcSteamPressureEstimation(minAtmosphericTemperature); // Check this case

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
