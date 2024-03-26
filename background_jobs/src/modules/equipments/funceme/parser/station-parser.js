import { CsvParser } from "./contracts/csv-parser.js";

export class StationParser extends CsvParser {
  constructor() {
    super();
  }
  getMetadata(string) {
    const [code, name, latitude, longitude, altitude] = string
      .slice(0, 5)
      .map((data) => data.split(":")[1]);

    const Altitude = altitude.trim();
    const Longitude = longitude.trim();
    const Latitude = latitude.trim();

    return {
      Code: code.trim(),
      Name: name.trim(),
      Latitude: Latitude === "nan" ? null : Latitude,
      Altitude: Altitude === "nan" ? null : Altitude,
      Longitude: Longitude === "nan" ? null : Longitude,
    };
  }

  splitMeasures(string) {
    return string.slice(5).join("\n");
  }

  static async parse(rawData = []) {
    const parser = new StationParser();
    return await parser.parse(rawData);
  }
}
