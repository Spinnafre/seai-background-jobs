import { PluviometerReadings } from "../../entities/funceme/pluviometer.js";
import { StationReadings } from "../../entities/funceme/station.js";
export class FuncemeMap {
  static stationMeasuresMap(measures = []) {
    return measures.map((measure) => {
      const [date, temperature, humidity, radiation] = Object.values(measure);

      return {
        date,
        temperature: parseFloat(temperature) || null,
        humidity: parseFloat(humidity) || null,
        radiation: parseFloat(radiation) || null,
      };
    });
  }

  static rainGaugeMeasuresMap(measures = []) {
    return measures.map((measure) => {
      const [date, pluviometer] = Object.values(measure);

      return {
        date,
        pluviometer: parseFloat(pluviometer) || null,
      };
    });
  }

  static stationToDomain(raw) {
    const { code, name, latitude, longitude, altitude, measures } = raw;
    const formatedMeasures = FuncemeMap.stationMeasuresMap(measures);

    return new StationReadings({
      code,
      name,
      latitude,
      longitude,
      altitude,
      measures: formatedMeasures,
    });
  }

  static rainGaugeToDomain(raw) {
    const { code, name, latitude, longitude, measures } = raw;

    const formatedMeasures = FuncemeMap.rainGaugeMeasuresMap(measures);

    return new PluviometerReadings({
      code,
      name,
      latitude,
      longitude,
      measures: formatedMeasures,
    });
  }
}
