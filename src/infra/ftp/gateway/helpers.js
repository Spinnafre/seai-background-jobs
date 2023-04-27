import { Transform, Readable } from "stream";

import { pipeline } from "stream/promises";

import csvParser from "csvtojson";

function parseCsv() {
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

        const measuresRaw = data.slice(5).join("\n");

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

async function parseCsvStream(stream) {
  let result = [];

  const parser = parseCsv();

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

export { filterDataByCodes, parseCsvStream };
