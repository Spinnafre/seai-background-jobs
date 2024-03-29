import csvParser from "csvtojson";

export async function parseCsvStringToJson(delimiter, string) {
  const data = await csvParser({
    delimiter,
  }).fromString(string);

  return data;
}
