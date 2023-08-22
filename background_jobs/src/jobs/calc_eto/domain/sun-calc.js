export function sunCalc(
  julianDay,
  solarRadiationTotal,
  altitude,
  temperatureAverage
) {
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
