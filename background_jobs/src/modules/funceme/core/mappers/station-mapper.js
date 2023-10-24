function parseMeasure(measure) {
  return parseFloat(measure) || null;
}
export class StationMapper {
  static toDomain(station) {
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
    ] = Object.values(station.measures);

    return {
      code: station.code,
      name: station.name,
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

  static toPersistency(station, measure, date = null) {
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
}
