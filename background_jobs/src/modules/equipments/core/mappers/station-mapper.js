function parseMeasure(measure) {
  return parseFloat(measure) || null;
}
export class StationMapper {
  static toDomain(station) {
    const [
      Time,
      AverageAtmosphericTemperature,
      MaxAtmosphericTemperature,
      MinAtmosphericTemperature,
      AverageRelativeHumidity,
      MaxRelativeHumidity,
      MinRelativeHumidity,
      AtmosphericPressure,
      WindVelocity,
      TotalRadiation,
    ] = Object.values(station.Measurements);

    return {
      Code: station.Code,
      Name: station.Name,
      Latitude: station.Latitude,
      Altitude: station.Altitude,
      Longitude: station.Longitude,
      FK_Organ: station.FK_Organ,
      Measurements: {
        Time,
        AverageAtmosphericTemperature: parseMeasure(
          AverageAtmosphericTemperature
        ),
        MaxAtmosphericTemperature: parseMeasure(MaxAtmosphericTemperature),
        MinAtmosphericTemperature: parseMeasure(MinAtmosphericTemperature),
        AverageRelativeHumidity: parseMeasure(AverageRelativeHumidity),
        MaxRelativeHumidity: parseMeasure(MaxRelativeHumidity),
        MinRelativeHumidity: parseMeasure(MinRelativeHumidity),
        AtmosphericPressure: parseMeasure(AtmosphericPressure),
        WindVelocity: parseMeasure(WindVelocity),
        TotalRadiation: parseMeasure(TotalRadiation),
      },
    };
  }

  static toPersistency(station, date = null) {
    const data = {
      IdEquipmentExternal: station.Code,
      Name: station.Name,
      Altitude: station.Altitude,
      Location: {
        Latitude: station.Latitude,
        Longitude: station.Longitude,
      },
      FK_Type: station.FK_Type,
      FK_Organ: station.FK_Organ,
      Enabled: false,
      Measurements: {
        TotalRadiation: null,
        MaxRelativeHumidity: null,
        MinRelativeHumidity: null,
        AverageRelativeHumidity: null,
        MaxAtmosphericTemperature: null,
        MinAtmosphericTemperature: null,
        AverageAtmosphericTemperature: null,
        AtmosphericPressure: null,
        WindVelocity: null,
        Et0: null,
      },
    };

    if (date)
      Object.assign(data.Measurements, {
        Time: date,
      });

    const {
      AverageAtmosphericTemperature,
      MaxAtmosphericTemperature,
      MinAtmosphericTemperature,
      AverageRelativeHumidity,
      MaxRelativeHumidity,
      MinRelativeHumidity,
      AtmosphericPressure,
      TotalRadiation,
      WindVelocity,
      Et0,
    } = station.Measurements;

    Object.assign(data.Measurements, {
      AverageAtmosphericTemperature: AverageAtmosphericTemperature || null,
      MaxAtmosphericTemperature: MaxAtmosphericTemperature || null,
      MinAtmosphericTemperature: MinAtmosphericTemperature || null,
      AverageRelativeHumidity: AverageRelativeHumidity || null,
      MaxRelativeHumidity: MaxRelativeHumidity || null,
      MinRelativeHumidity: MinRelativeHumidity || null,
      AtmosphericPressure: AtmosphericPressure || null,
      TotalRadiation: TotalRadiation || null,
      WindVelocity: WindVelocity || null,
      Et0: Et0 || null,
    });

    return data;
  }
}
