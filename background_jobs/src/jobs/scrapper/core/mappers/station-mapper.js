import { Logger } from "../../../../lib/logger/logger.js";

function parseMeasure(measure) {
  return parseFloat(measure) || null;
}
export class StationMapper {
  static mapMeasures(measures) {
    const [
      date,
      averageAtmosphericTemperature,
      maxAtmosphericTemperature,
      minAtmosphericTemperature,
      averageRelativeHumidity,
      maxRelativeHumidity,
      minRelativeHumidity,
      atmosphericPressure,
      windVelocity,
      totalRadiation,
    ] = Object.values(measures);

    return {
      date,
      averageAtmosphericTemperature: parseMeasure(
        averageAtmosphericTemperature
      ),
      maxAtmosphericTemperature: parseMeasure(maxAtmosphericTemperature),
      minAtmosphericTemperature: parseMeasure(minAtmosphericTemperature),
      averageRelativeHumidity: parseMeasure(averageRelativeHumidity),
      maxRelativeHumidity: parseMeasure(maxRelativeHumidity),
      minRelativeHumidity: parseMeasure(minRelativeHumidity),
      atmosphericPressure: parseMeasure(atmosphericPressure),
      windVelocity: parseMeasure(windVelocity),
      totalRadiation: parseMeasure(totalRadiation),
    };
  }

  static stationToPersistency(station, measure, date = null) {
    const data = {
      TotalRadiation: null,
      MaxRelativeHumidity: null,
      MinRelativeHumidity: null,
      AverageRelativeHumidity: null,
      MaxAtmosphericTemperature: null,
      MinAtmosphericTemperature: null,
      AverageAtmosphericTemperature: null,
      AtmosphericPressure: null,
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

    const {
      averageAtmosphericTemperature,
      maxAtmosphericTemperature,
      minAtmosphericTemperature,
      averageRelativeHumidity,
      maxRelativeHumidity,
      minRelativeHumidity,
      atmosphericPressure,
      totalRadiation,
      windVelocity,
    } = measure;

    return Object.assign(data, {
      AverageAtmosphericTemperature: averageAtmosphericTemperature || null,
      MaxAtmosphericTemperature: maxAtmosphericTemperature || null,
      MinAtmosphericTemperature: minAtmosphericTemperature || null,
      AverageRelativeHumidity: averageRelativeHumidity || null,
      MaxRelativeHumidity: maxRelativeHumidity || null,
      MinRelativeHumidity: minRelativeHumidity || null,
      AtmosphericPressure: atmosphericPressure || null,
      TotalRadiation: totalRadiation || null,
      WindVelocity: windVelocity || null,
    });
  }

  static stationsToPersistency(stations = [], measures = [], date = null) {
    return stations.map((station) => {
      const data = {
        TotalRadiation: null,
        AverageRelativeHumidity: null,
        MaxRelativeHumidity: null,
        MinRelativeHumidity: null,
        MaxAtmosphericTemperature: null,
        MinAtmosphericTemperature: null,
        AverageAtmosphericTemperature: null,
        AtmosphericPressure: null,
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

      const {
        averageAtmosphericTemperature,
        maxAtmosphericTemperature,
        minAtmosphericTemperature,
        averageRelativeHumidity,
        maxRelativeHumidity,
        minRelativeHumidity,
        atmosphericPressure,
        totalRadiation,
        windVelocity,
      } = measure;

      Logger.info({
        msg: `Sucesso ao obter dados de medição estação ${station.code}`,
      });

      return Object.assign(data, {
        AverageAtmosphericTemperature: averageAtmosphericTemperature || null,
        MaxAtmosphericTemperature: maxAtmosphericTemperature || null,
        MinAtmosphericTemperature: minAtmosphericTemperature || null,
        AverageRelativeHumidity: averageRelativeHumidity || null,
        MaxRelativeHumidity: maxRelativeHumidity || null,
        MinRelativeHumidity: minRelativeHumidity || null,
        AtmosphericPressure: atmosphericPressure || null,
        TotalRadiation: totalRadiation || null,
        WindVelocity: windVelocity || null,
      });
    });
  }
}
