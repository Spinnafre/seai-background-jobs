import { Pluviometer } from "../../entities/pluviometer.js";
import { Station } from "../../entities/station.js";
export class FuncemeMap {
  static stationMeasuresMap(measures) {
    const [date, temperature, humidity, radiation] = Object.values(measures);

    return {
      date,
      temperature: parseFloat(temperature) || null,
      humidity: parseFloat(humidity) || null,
      radiation: parseFloat(radiation) || null,
    };
  }

  static PluviometerMeasuresMap(measures = []) {
    const [date, pluviometer] = Object.values(measures);

    return {
      date,
      pluviometer: parseFloat(pluviometer) || null,
    };
  }

  static stationToDomain(raw) {
    const { code, name, organ, altitude, measures } = raw;

    const formatedMeasures = FuncemeMap.stationMeasuresMap(measures);

    return new Station({
      code,
      name,
      organ,
      altitude,
      measures: formatedMeasures,
    });
  }

  static pluviometerToDomain(raw) {
    const { code, name, organ, measures } = raw;

    const formatedMeasures = FuncemeMap.PluviometerMeasuresMap(measures);

    return new Pluviometer({
      code,
      name,
      organ,
      measures: formatedMeasures,
    });
  }
}
