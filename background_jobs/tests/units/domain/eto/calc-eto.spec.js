describe("ETO calc", () => {
  test("shoud be able to calc sun", async function () {
    const equipments = [
      {
        IdEquipment: 1,
        IdEquipmentExternal: "A325",
        Name: "Fortaleza",
        Altitude: 35,
        FK_Organ: 2,
        Organ: "FUNCEME",
        Type: "station",
        CreatedAt: new Date(),
        UpdatedAt: null,
      },
    ];

    const readStations = [
      {
        TotalRadiation: 10,
        RelativeHumidity: 2,
        AtmosphericTemperature: 3,
        WindVelocity: 4,
        Time: "17/08/2023",
        FK_Organ: 2,
        FK_Equipment: 1,
      },
    ];

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
  });
});
