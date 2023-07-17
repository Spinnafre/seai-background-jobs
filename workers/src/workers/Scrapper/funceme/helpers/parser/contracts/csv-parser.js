import { parseCsvStringToJson } from "../../../external/adapters/csvparser/csv-parser-adapter.js";

export class CsvParser {
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

      const measures = await parseCsvStringToJson(",", measuresRaw);

      parsed.push({
        ...metadata,
        measures,
      });
    }

    return parsed;
  }
}
