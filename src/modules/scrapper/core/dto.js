import { FormatDate } from "../../shared/index.js";

class DTO {
  timestamp;

  constructor(timestamp) {
    this.timestamp = timestamp;
  }

  getDate() {
    throw new Error("Not implemented");
  }
}

export class InmetDataMinerDTO extends DTO {
  constructor(timestamp) {
    super(timestamp);
  }

  getDate() {
    return FormatDate.timestampToDate(this.timestamp, { separator: "/" });
  }
}

export class FuncemeDataMinerDTO extends DTO {
  constructor(timestamp) {
    super(timestamp);
  }

  getDate() {
    return FormatDate.timestampToDate(this.timestamp, { separator: "-" });
  }
}
