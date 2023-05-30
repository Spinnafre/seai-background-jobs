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
    const { IdEquipmentExternal, IdEquipment, Name, Type, FK_Organ, Altitude } =
      raw;

    return new Equipment(
      {
        code: IdEquipmentExternal,
        name: Name,
        organ: {
          id: FK_Organ,
        },
        type: Type.Name,
      },
      IdEquipment,
      Altitude
    );
  }

  static equipmentsToDomain(rawList = []) {
    return rawList.map((raw) => Mapper.equipmentToDomain(raw));
  }

  static pluviometerToPersistency(pluviometer, measure) {
    if (!measure) {
      console.log(
        `Não foi possível obter dados de medição do pluviômetro ${pluviometer.name}, salvando dados sem medições`
      );

      return {
        Value: null,
        FK_Time: null,
        FK_Organ: pluviometer.organ.id,
        FK_Equipment: pluviometer.id,
      };
    }

    // const { pluviometer } = measure;

    return {
      Value: measure.pluviometer,
      FK_Time: null,
      FK_Organ: pluviometer.organ.id,
      FK_Equipment: pluviometer.id,
    };
  }

  static stationToPersistency(station, measure) {
    if (!measure) {
      return {
        TotalRadiation: null,
        RelativeHumidity: null,
        AtmosphericTemperature: null,
        WindVelocity: null,
        FK_Time: null,
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
      FK_Time: null,
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
          FK_Time: null,
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
        FK_Time: null,
        FK_Organ: station.organ.id,
        FK_Equipment: station.id,
      };
    });
  }

  static pluviometerToPersistency(pluviometers = [], measures = []) {
    return pluviometers.map((pluviometer) => {
      const measure =
        measures && measures.find((item) => item.code === pluviometer.code);

      if (!measure) {
        console.log(
          `Não foi possível obter dados de medição do pluviômetro ${pluviometer.name}, salvando dados sem medições`
        );

        return {
          Value: null,
          FK_Time: null,
          FK_Organ: pluviometer.organ.id,
          FK_Equipment: pluviometer.id,
        };
      }

      // const { pluviometer } = measure;

      return {
        Value: measure.pluviometer,
        FK_Time: null,
        FK_Organ: pluviometer.organ.id,
        FK_Equipment: pluviometer.id,
      };
    });
  }
}
