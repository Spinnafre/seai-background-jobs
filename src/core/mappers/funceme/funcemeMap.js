import { PluviometerReadings } from "../../entities/funceme/pluviometer.js";
import { StationReadings } from "../../entities/funceme/station.js";

export class FuncemeMap {
  static splitMetadata(raw) {
    const data = raw.trim().split("\n");

    const info = data.slice(0, 5).map((data) => data.split(":")[1]);

    return {
      info,
      data,
    };
  }

  static stationStringToDomain(raw = "") {
    const { data, info } = FuncemeMap.splitMetadata(raw);

    const [code, name, latitude, longitude, altitude] = info;

    const measures = data.slice(6).map((row) => {
      const [date, temperature, humidity, radiation] = row.split(",");
      return {
        date,
        temperature: parseFloat(temperature) || null,
        humidity: parseFloat(humidity) || null,
        radiation: parseFloat(radiation) || null,
      };
    });

    const stationName = name && name.trim();
    const stationCode = code && code.trim();

    return new StationReadings({
      code: stationCode,
      name: stationName,
      latitude,
      longitude,
      altitude,
      measures,
    });
  }

  static rainGaugeStringToDomain(raw = "") {
    const { data, info } = FuncemeMap.splitMetadata(raw);

    const [code, name, latitude, longitude] = info;

    const measures = data.slice(6).map((row) => {
      const [date, pluviometer] = row.split(",");
      return {
        date,
        pluviometer: parseFloat(pluviometer) || null,
      };
    });

    const pluviometerName = name && name.trim();
    const pluviometerCode = code && code.trim();

    return new PluviometerReadings({
      code: pluviometerCode,
      name: pluviometerName,
      latitude,
      longitude,
      measures,
    });
  }
}
