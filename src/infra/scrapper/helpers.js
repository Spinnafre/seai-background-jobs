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
      throw new Error(hasNullOrUndefined.error)
    }


    const hasValidMeasures = Validator.checkIfRawArrayHasValidValues(
      params.params,
      validMeasures
    );

    if (hasValidMeasures.isFailure) {
      throw new Error(hasValidMeasures.error)
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
        throw new Error(hasValidAttr.error);
      }
    }

    return true
  }