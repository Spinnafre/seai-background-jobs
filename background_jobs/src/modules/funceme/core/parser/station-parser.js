import { CsvParser } from "./contracts/csv-parser.js";

export class StationParser extends CsvParser {
  constructor() {
    super();
  }
  getMetadata(string) {
    const [code, name, latitude, longitude, altitude] = string
      .slice(0, 5)
      .map((data) => data.split(":")[1]);

    return {
      code: code.trim(),
      name: name.trim(),
      latitude: latitude.trim(),
      altitude: altitude.trim(),
      longitude: longitude.trim(),
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
