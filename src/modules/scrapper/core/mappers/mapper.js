import { Equipment } from "../equipments/equipment.js";

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

  static equipmentToDomain(raw) {
    const {
      IdEquipmentExternal,
      IdEquipment,
      Name,
      FK_Organ,
      Organ,
      Altitude,
    } = raw;

    return new Equipment(
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

  static equipmentsToDomain(rawList = []) {
    return rawList.map((raw) => Mapper.equipmentToDomain(raw));
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
