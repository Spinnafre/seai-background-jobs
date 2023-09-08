import { Logger } from "../../../../lib/logger/logger.js";

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

  static stationToPersistency(station, measure, date = null) {
    const data = {
      TotalRadiation: null,
      RelativeHumidity: null,
      AtmosphericTemperature: null,
      WindVelocity: null,
      FK_Organ: station.id_organ,
      FK_Equipment: station.id,
    };

    if (date)
      Object.assign(data, {
        Time: date,
      });

    if (!measure) {
      return data;
    }

    const { radiation, humidity, temperature, windVelocity } = measure;

    return Object.assign(data, {
      TotalRadiation: radiation || null,
      RelativeHumidity: humidity || null,
      AtmosphericTemperature: temperature || null,
      WindVelocity: windVelocity || null,
    });
  }

  static stationsToPersistency(stations = [], measures = [], date = null) {
    return stations.map((station) => {
      const data = {
        TotalRadiation: null,
        RelativeHumidity: null,
        AtmosphericTemperature: null,
        WindVelocity: null,
        FK_Organ: station.id_organ,
        FK_Equipment: station.id,
      };

      if (date)
        Object.assign(data, {
          Time: date,
        });

      const measure =
        measures && measures.find((item) => item.code === station.code);

      if (!measure) {
        Logger.warn({
          msg: `Não foi possível obter dados de medição estação ${station.code}, salvando dados sem medições`,
        });

        return data;
      }

      const { radiation, humidity, temperature, windVelocity } = measure;

      Logger.info({
        msg: `Sucesso ao obter dados de medição estação ${station.code}`,
      });

      return Object.assign(data, {
        TotalRadiation: radiation || null,
        RelativeHumidity: humidity || null,
        AtmosphericTemperature: temperature || null,
        WindVelocity: windVelocity || null,
      });
    });
  }
}
