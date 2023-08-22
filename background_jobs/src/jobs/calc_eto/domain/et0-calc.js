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

export function calcEto({
  delta,
  liquidRad,
  flowDensity,
  g_asterico,
  gama,
  temperatureAverage,
  windVelocity,
  saturationSteamPressure,
  currentSteamPressureValue,
}) {
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

  return {
    et0,
    rad,
  };
}
