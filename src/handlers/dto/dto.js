import { FormatDate, Notification, Validator } from "../../utils/index.js";

class DTO {
  timestamp;
  idTimestamp;
  commandLogs;

  constructor(idTime, timestamp) {
    this.timestamp = timestamp;
    this.idTimestamp = idTime;
    this.commandLogs = new Notification();
  }

  getDate() {
    throw new Error("Not implemented");
  }
}

export class FuncemeDataMinerDTO extends DTO {
  constructor(idTime, timestamp) {
    super(idTime, timestamp);
  }
  getDate() {
    return FormatDate.timestampToDate(this.timestamp, { separator: "-" });
  }
}

export class InmetDataMinerDTO extends DTO {
  constructor(idTime, timestamp,params) {
    super(idTime, timestamp);
  }

  getDate() {
    return FormatDate.timestampToDate(this.timestamp, { separator: "/" });
  }

  static create(idTime, timestamp,params){
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
  }
}
