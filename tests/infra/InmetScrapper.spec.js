import {
  describe,
  expect,
  test,
  jest,
  afterEach,
  beforeEach,
} from "@jest/globals";

import { InmetScrapper } from "../../src/infra/scrapper/inmet-scrapper.js";

describe("#Inmet params validator", () => {
  let scrapper = null;
  afterEach(() => {
    jest.restoreAllMocks();
  });

  beforeEach(async () => {
    const mockStaticBuild = jest
      .fn()
      .mockResolvedValue(new InmetScrapper("http://test.com", {}, {}));

    InmetScrapper.build = mockStaticBuild;

    scrapper = await InmetScrapper.build();
  });

  test("Should be able to set parameters to query when params is valid", async function () {
    const params = {
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

    const resultOrError = scrapper.setParams(params);

    expect(resultOrError.isSuccess).toBeTruthy();
    expect(resultOrError.isFailure).toBeFalsy();
    expect(scrapper.props).toMatchObject(params);
  });

  test("Should return error when insert invalid country", async function () {
    const params = {
      country: "TEST",
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

    const resultOrError = scrapper.setParams(params);

    const validCountries = ["BRAZIL", "N", "NE", "CO", "SE", "S"];

    expect(resultOrError.isFailure).toBeTruthy();
    expect(resultOrError.isSuccess).toBeFalsy();
    expect(resultOrError.error).toBe(
      `Country isn't oneOf the correct types in ${JSON.stringify(
        validCountries
      )}. Got "${params.country}".`
    );
  });

  test("Should return error when insert invalid stations type", async function () {
    const params = {
      country: "NE",
      stations_type: "AUTOMÁTICA",
      state: "CE",
      date_type: "diario",
      params: [
        "Precipitação Total (mm)",
        "Temp. Média (°C)",
        "Umi. Média (%)",
        "Vel. do Vento Média (m/s)",
      ],
    };

    const resultOrError = scrapper.setParams(params);

    const validStationsTypes = ["todas", "automaticas", "convencionais"];

    expect(resultOrError.isFailure).toBeTruthy();
    expect(resultOrError.isSuccess).toBeFalsy();
    expect(resultOrError.error).toBe(
      `Stations types isn't oneOf the correct types in ${JSON.stringify(
        validStationsTypes
      )}. Got "${params.stations_type}".`
    );
  });

  test("Should return error when insert invalid date type", async function () {
    const params = {
      country: "NE",
      stations_type: "automaticas",
      state: "CE",
      date_type: "anual",
      params: [
        "Precipitação Total (mm)",
        "Temp. Média (°C)",
        "Umi. Média (%)",
        "Vel. do Vento Média (m/s)",
      ],
    };

    const resultOrError = scrapper.setParams(params);

    const validDatesTypes = ["diario", "horario", "mensal", "prec", "extremos"];

    expect(resultOrError.isFailure).toBeTruthy();
    expect(resultOrError.isSuccess).toBeFalsy();
    expect(resultOrError.error).toBe(
      `Date type isn't oneOf the correct types in ${JSON.stringify(
        validDatesTypes
      )}. Got "${params.date_type}".`
    );
  });

  test("Should return error when insert invalid measures", async function () {
    const params = {
      country: "NE",
      stations_type: "automaticas",
      state: "CE",
      date_type: "diario",
      params: [
        "Precipitação Total",
        "Temp. Média (°C)",
        "Umi. Média (%)",
        "Vel. do Vento Média (m/s)",
      ],
    };

    const resultOrError = scrapper.setParams(params);

    const validMeasures = [
      "Precipitação Total (mm)",
      "Vel. do Vento Média (m/s)",
      "Raj. do Vento Máxima (m/s)",
      "Temp. Média (°C)",
      "Temp. Máxima (°C)",
      "Temp. Mínima (°C)",
      "Umi. Média (%)",
      "Umi. Mínima (%)",
    ];

    expect(resultOrError.isFailure).toBeTruthy();
    expect(resultOrError.isSuccess).toBeFalsy();
    expect(resultOrError.error).toBe(
      `[ERROR] : Precipitação Total is not included in ${JSON.stringify(
        validMeasures
      )}`
    );
  });
});
