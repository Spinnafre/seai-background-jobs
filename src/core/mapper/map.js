import { Pluviometer } from "../equipments/pluviometer.js";
import { Station } from "../equipments/station.js";

export class Mapper {
  static stationMeasures(measures) {
    const [date, temperature, humidity, radiation] = Object.values(measures);

    return {
      date,
      temperature: parseFloat(temperature) || null,
      humidity: parseFloat(humidity) || null,
      radiation: parseFloat(radiation) || null,
    };
  }

  static pluviometerMeasures(measures = []) {
    const [date, pluviometer] = Object.values(measures);

    return {
      date,
      pluviometer: parseFloat(pluviometer) || null,
    };
  }

  static stationToDomain(raw) {
    const {
      IdEquipmentExternal,
      IdEquipment,
      Name,
      FK_Organ,
      Organ,
      Altitude,
    } = raw;

    return new Station(
      {
        code: IdEquipmentExternal,
        name: Name,
        organ: {
          id: FK_Organ,
          name: Organ,
        },
      },
      IdEquipment,
      Altitude
    );
  }

  static stationsToDomain(rawList = []) {
    return rawList.map((raw) => Mapper.stationToDomain(raw));
  }

  static pluviometersToDomain(rawList = []) {
    return rawList.map((raw) => Mapper.pluviometerToDomain(raw));
  }

  static pluviometerToDomain(raw) {
    const { IdEquipmentExternal, IdEquipment, Name, FK_Organ, Organ } = raw;

    return new Pluviometer(
      {
        code: IdEquipmentExternal,
        name: Name,
        organ: {
          id: FK_Organ,
          name: Organ,
        },
      },
      IdEquipment
    );
  }

  static stationsToPersistency(stations = [], measures = [], idTime) {
    return stations.map((station) => {
      const measure =
        measures && measures.find((item) => item.code === station.code);

      if (!measure) {
        return {
          TotalRadiation: null,
          RelativeHumidity: null,
          AtmosphericTemperature: null,
          WindVelocity: null,
          FK_Time: idTime,
          FK_Organ: station.organ.id,
          FK_Equipment: station.id,
        };
      }

      const { radiation, humidity, temperature, windSpeed } = measure;

      return {
        TotalRadiation: radiation,
        RelativeHumidity: humidity,
        AtmosphericTemperature: temperature,
        WindVelocity: windSpeed,
        FK_Time: idTime,
        FK_Organ: station.organ.id,
        FK_Equipment: station.id,
      };
    });
  }

  static pluviometerToPersistency(pluviometers = [], measures = [], idTime) {
    return pluviometers.map((pluviometer) => {
      const measure =
        measures && measures.find((item) => item.code === pluviometer.code);

      if (!measure) {
        return {
          Value: null,
          FK_Time: idTime,
          FK_Organ: pluviometer.organ.id,
          FK_Equipment: pluviometer.id,
        };
      }

      const { pluviometer } = measure;

      return {
        Value: pluviometer,
        FK_Time: idTime,
        FK_Organ: pluviometer.organ.id,
        FK_Equipment: pluviometer.id,
      };
    });
  }
}
