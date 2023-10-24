import { DateFormatter } from "../date-formatter.js";

export class WorkerHandlerDTO {
  #data = null;
  #id = null;
  #name = null;
  #startedDate = null;
  #createdAt = null;

  constructor(
    payload = {
      data: null,
      id: null,
      name: null,
      startedon: null,
      createdon: null,
    }
  ) {
    this.#id = payload.id;
    this.#data = payload.data;
    this.#name = payload.name;
    this.#startedDate = payload.startedon
      ? new Date(Number(payload.startedon))
      : null;
    // this.#createdAt = payload.createdon;
  }

  get name() {
    return this.#name;
  }

  get id() {
    return this.#id;
  }

  get payload() {
    return this.#data;
  }

  get startedDate() {
    return this.#startedDate ? new Date(Number(this.#startedDate)) : null;
  }
}

export class DailyWorkerDTO extends WorkerHandlerDTO {
  #date;

  constructor(payload) {
    super(payload);
    this.setExecutionDate();
  }

  setExecutionDate() {
    const hasStartDateInPayload =
      this.payload && Reflect.has(this.payload, "dateString");

    if (hasStartDateInPayload) {
      // DD/MM/YYYY to Date
      const toDate = DateFormatter.convertDateStringToDate(
        this.payload.dateString
      );

      console.log(
        `[DailtyWorker] Starting worker ${this.name} in ${toDate.toISOString()}`
      );

      this.#date = toDate;
      return;
    }

    this.#date = this.getDateToQuery();
  }

  getDateToQuery() {
    throw new Error("Not implemented");
  }

  getTimestamp() {
    return this.#date.getTime();
  }
}
