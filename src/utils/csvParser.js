import csvParser from "csvtojson";

class CsvParser {
  splitMeasures(string) {
    throw new Error("Not implemented");
  }

  getMetadata(string) {
    throw new Error("Not implemented");
  }

  async parse(rawData = []) {
    const parsed = [];

    for (const item of rawData) {
      const data = item.trim().split("\n");

      const metadata = this.getMetadata(data);

      const measuresRaw = this.splitMeasures(data);

      const measures = await csvParser({
        delimiter: ",",
      }).fromString(measuresRaw);

      parsed.push({
        ...metadata,
        measures,
      });
    }

    return parsed;
  }
}

class StationParser extends CsvParser {
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

class PluviometerParser extends CsvParser {
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

export { StationParser, PluviometerParser };
