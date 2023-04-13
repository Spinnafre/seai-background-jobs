import { describe, expect, test, jest, afterEach } from "@jest/globals";

import { InmetScrapper } from "../../src/infra/scrapper/inmet-scrapper.js";

import { ExtractStationsFromInmet } from "../../src/services/commands/extractStationsFromInmet.js";

jest.setTimeout(60000);

let params = {
  country: "NE",
  stations_type: "automaticas",
  state: "CE",
  date_type: "diario",
  params: [
    "Precipitação Total (mm)",
    "Temp. Média (°C)",
    "Umi. Média (%)",
    "Vel. do Vento Média (m/s)",
  ],
};
describe("#Extrat station from inmet service", () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  test("Should be able to get station code,name and location from INMET", async function () {
    const service = new ExtractStationsFromInmet(InmetScrapper);

    const result = await service.execute(params);

    expect(result.isSuccess).toBeTruthy();

    result.value.forEach((station) => {
      expect(station).toHaveProperty("name");
      expect(station).toHaveProperty("code");
      expect(station).toHaveProperty("state");
      expect(station).toHaveProperty("country");
    });
  });

  jest.retryTimes(3);
  test("Shouldn't be able to get station from INMET when timeout is equal to tolerance time ", async function () {
    const service = new ExtractStationsFromInmet(InmetScrapper);

    const timeout = 2000;

    const result = await service.execute(params, timeout);

    expect(result.isSuccess).toBeFalsy();
    expect(result.error).toBe(`Exceeded the tolerance time limit ${timeout}`);
  });
});
