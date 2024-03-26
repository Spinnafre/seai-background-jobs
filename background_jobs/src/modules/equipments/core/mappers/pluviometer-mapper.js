import { Logger } from "../../../../shared/logger";

export class PluviometerMapper {
  static toDomain(pluviometerEqp) {
    const [time, pluviometry] = Object.values(pluviometerEqp.Measurements);

    const toFloat = parseFloat(pluviometry);
    return {
      Code: pluviometerEqp.Code,
      Name: pluviometerEqp.Name,
      Latitude: pluviometerEqp.Latitude,
      Altitude: pluviometerEqp.Altitude,
      Longitude: pluviometerEqp.Longitude,
      // FK_Organ: pluviometerEqp.FK_Organ,
      Measurements: {
        Time: time,
        Pluviometry: toFloat >= 0 ? toFloat : null,
      },
    };
  }

  static toPersistency(pluviometer, date = null) {
    const data = {
      IdEquipmentExternal: pluviometer.Code,
      Name: pluviometer.Name,
      Altitude: pluviometer.Altitude,
      Location: [pluviometer.Latitude, pluviometer.Longitude],
      FK_Type: pluviometer.FK_Type,
      FK_Organ: pluviometer.FK_Organ,
      Enabled: false,
      Measurements: {
        Value: null, // TO-DO : fiz column name in database
      },
    };

    if (date)
      Object.assign(data.Measurements, {
        Time: date,
      });

    if (!pluviometer.Pluviometry) {
      Logger.warn({
        msg: `Não foi possível obter dados de medição do pluviômetro ${pluviometer.Code}, salvando dados sem medições`,
      });

      return data;
    }

    // const { pluviometer } = measure;

    Object.assign(data, {
      Value: pluviometer.Measurements.Pluviometry,
    });

    return data;
  }
}