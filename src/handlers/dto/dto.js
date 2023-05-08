import { FormatDate, Notification } from "../../utils/index.js";

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
  constructor(idTime, timestamp) {
    super(idTime, timestamp);
  }

  getDate() {
    return FormatDate.timestampToDate(this.timestamp, { separator: "/" });
  }
}
