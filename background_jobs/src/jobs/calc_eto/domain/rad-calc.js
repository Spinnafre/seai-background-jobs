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
