import { Result } from "../../utils/Result";
import { Validator } from "../../utils/Validator";

export function validateParams(
    params = {
      country: "",
      stations_type: "",
      state: "",
      date_type: "",
      params: [],
    }
  ) {
    const hasNullOrUndefined = Validator.againstNullOrUndefinedBulk([
      { argument: params.country, argumentName: "Country" },
      { argument: params.date_type, argumentName: "Date type" },
      { argument: params.params, argumentName: "Stations measures" },
      { argument: params.state, argumentName: "State" },
      { argument: params.stations_type, argumentName: "Stations types" },
    ]);

    if (hasNullOrUndefined.isFailure) {
      return Result.error(hasNullOrUndefined.error);
    }

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

    const validCountries = ["BRAZIL", "N", "NE", "CO", "SE", "S"];

    const validStationsTypes = ["todas", "automaticas", "convencionais"];

    const validDates = ["diario", "horario", "mensal", "prec", "extremos"];

    const hasValidMeasures = Validator.checkIfRawArrayHasValidValues(
      params.params,
      validMeasures
    );

    if (hasValidMeasures.isFailure) {
      return Result.error(hasValidMeasures.error);
    }

    const attrs = [
      {
        argument: params.country,
        argumentName: "Country",
        validValues: validCountries,
      },
      {
        argument: params.date_type,
        argumentName: "Date type",
        validValues: validDates,
      },
      {
        argument: params.stations_type,
        argumentName: "Stations types",
        validValues: validStationsTypes,
      },
    ];

    for (const { argument, argumentName, validValues } of attrs) {
      const hasValidAttr = Validator.isOneOf(
        {
          argument,
          argumentName,
        },
        validValues
      );

      if (hasValidAttr.isFailure) {
        return Result.error(hasValidAttr.error);
      }
    }

    return Result.success(params);
  }