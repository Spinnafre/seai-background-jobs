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
