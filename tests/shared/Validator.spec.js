import * as jest from "@jest/globals";

import { Validator } from "../../src/utils/Validator.js";

describe("Validator", function () {
  test("Should be able to create a error Result when null or undefined", () => {
    const country = null;
    const argumentName = "Country";
    const result = Validator.againstNullOrUndefined(country, argumentName);

    expect(result.isSuccess).toBeFalsy();
    expect(result.isFailure).toBeTruthy();
    expect(result.error).toEqual(
      `[ERROR] : ${argumentName} is null or undefined`
    );
  });

  test("Should be able to create a error Result when an argument is null or undefined in array of arguments", () => {
    const props = {
      country: "NE",
      stations_type: "",
      state: "CE",
      date_type: "diario",
      params: [
        "Precipitação Total (mm)",
        "Temp. Média (°C)",
        "Umi. Média (%)",
        "Vel. do Vento Média (m/s)",
      ],
    };

    const args = [
      { argument: props.country, argumentName: "Country" },
      { argument: props.date_type, argumentName: "Date type" },
      { argument: props.params, argumentName: "Stations measures" },
      { argument: props.state, argumentName: "State" },
      { argument: props.stations_type, argumentName: "Stations types" },
    ];

    const result = Validator.againstNullOrUndefinedBulk(args);

    expect(result.isSuccess).toBeFalsy();
    expect(result.isFailure).toBeTruthy();
    expect(result.error).toEqual(
      `[ERROR] : ${args[4].argumentName} is null or undefined`
    );
  });

  test("Should be able to create a success Result when argument include in array of valid values", () => {
    const measures = [
      "Precipitação Total (mm)",
      "Temp. Média (°C)",
      "Umi. Média (%)",
      "Vel. do Vento Média (m/s)",
    ];

    const result = Validator.checkIfRawArrayHasValidValues(measures, [
      "Precipitação Total (mm)",
      "Vel. do Vento Média (m/s)",
      "Raj. do Vento Máxima (m/s)",
      "Temp. Média (°C)",
      "Temp. Máxima (°C)",
      "Temp. Mínima (°C)",
      "Umi. Média (%)",
      "Umi. Mínima (%)",
    ]);

    expect(result.isSuccess).toBeTruthy();
    expect(result.isFailure).toBeFalsy();
  });

  test("Should be able to create a error Result when argument not included in array of valid values", () => {
    const measures = [
      "Precipitação Total",
      "Temp. Média (°C)",
      "Umi. Média (%)",
      "Vel. do Vento Média (m/s)",
    ];

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

    const result = Validator.checkIfRawArrayHasValidValues(
      measures,
      validMeasures
    );

    expect(result.isSuccess).toBeFalsy();
    expect(result.isFailure).toBeTruthy();
    expect(result.error).toEqual(
      `[ERROR] : Precipitação Total is not included in ${JSON.stringify(
        validMeasures
      )}`
    );
  });
});
