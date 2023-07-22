import { CsvParser } from "./contracts/csv-parser.js";

export class PluviometerParser extends CsvParser {
  constructor() {
    super();
  }
  getMetadata(string) {
    const [code, name, latitude, longitude] = string
      .slice(0, 5)
      .map((data) => data.split(":")[1]);

    return {
      code: code.trim(),
      name: name.trim(),
      latitude: latitude.trim(),
      longitude: longitude.trim(),
    };
  }

  splitMeasures(string) {
    return string.slice(4).join("\n");
  }

  static async parse(rawData = []) {
    const parser = new PluviometerParser();
    return await parser.parse(rawData);
  }
}
