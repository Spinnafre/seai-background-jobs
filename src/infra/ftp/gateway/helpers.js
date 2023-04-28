import { Transform, Readable } from "stream";

import { pipeline } from "stream/promises";

import csvParser from "csvtojson";

function parseCsv(measureType) {
  return new Transform({
    objectMode: true,
    async transform(chunk, enc, next) {
      const string = chunk.toString();
      if (!string) return next(new Error("File is empty"));

      const rows = string.split("\n\n").filter((item) => item !== "\n");
      const serializedRows = [];

      for (const row of rows) {
        const data = row.trim().split("\n");

        const [code, name, latitude, longitude] = data
          .slice(0, 5)
          .map((data) => data.split(":")[1]);

        const measuresRaw =
          measureType === "station"
            ? data.slice(5).join("\n")
            : data.slice(4).join("\n");

        const measures = await csvParser({
          delimiter: ",",
        }).fromString(measuresRaw);

        serializedRows.push({
          code: code.trim(),
          name: name.trim(),
          latitude: latitude.trim(),
          longitude: longitude.trim(),
          measures,
        });
      }

      next(null, serializedRows);
    },
  });
}

function createReadableFromBuffer(buffer) {
  return Readable.from(buffer);
}

async function parseCsvStream(stream, measureType) {
  let result = [];

  const parser = parseCsv(measureType);

  parser.on("data", (item) => {
    result = item;
  });

  await pipeline(createReadableFromBuffer(stream), parser);

  return result;
}

function filterDataByCodes(codes = [], data = []) {
  const filtered = data.filter((item) => codes.includes(item.code));
  return filtered;
}
function filterMeasuresByDate(date, data = []) {
  data.map((item) => {
    const measures = item.measures.filter((measures) => measures.data === date);
    item.measures = measures;
  });
  return data;
}

export { filterDataByCodes, filterMeasuresByDate, parseCsvStream };
