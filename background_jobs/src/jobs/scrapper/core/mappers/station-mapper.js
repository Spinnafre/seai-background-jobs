export class StationMapper {
  static mapMeasures(measures) {
    const [date, temperature, humidity, radiation] = Object.values(measures);

    return {
      date,
      temperature: parseFloat(temperature) || null,
      humidity: parseFloat(humidity) || null,
      radiation: parseFloat(radiation) || null,
    };
  }

  static stationToPersistency(station, measure) {
    if (!measure) {
      return {
        TotalRadiation: null,
        RelativeHumidity: null,
        AtmosphericTemperature: null,
        WindVelocity: null,
        FK_Organ: station.organ.id,
        FK_Equipment: station.id,
      };
    }

    const { radiation, humidity, temperature, windVelocity } = measure;

    return {
      TotalRadiation: radiation || null,
      RelativeHumidity: humidity || null,
      AtmosphericTemperature: temperature || null,
      WindVelocity: windVelocity || null,
      FK_Organ: station.organ.id,
      FK_Equipment: station.id,
    };
  }

  static stationsToPersistency(stations = [], measures = []) {
    return stations.map((station) => {
      const measure =
        measures && measures.find((item) => item.code === station.code);

      if (!measure) {
        console.log(
          `Não foi possível obter dados de medição estação ${station.name}, salvando dados sem medições`
        );

        return {
          TotalRadiation: null,
          RelativeHumidity: null,
          AtmosphericTemperature: null,
          WindVelocity: null,
          FK_Organ: station.organ.id,
          FK_Equipment: station.id,
        };
      }

      const { radiation, humidity, temperature, windVelocity } = measure;

      console.log(`Sucesso ao obter dados de medição estação ${station.name}`);

      return {
        TotalRadiation: radiation || null,
        RelativeHumidity: humidity || null,
        AtmosphericTemperature: temperature || null,
        WindVelocity: windVelocity || null,
        FK_Organ: station.organ.id,
        FK_Equipment: station.id,
      };
    });
  }
}
