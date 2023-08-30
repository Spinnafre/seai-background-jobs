import { connections } from "../connection.js";

export class LogRepository {
  #connection;

  constructor() {
    this.#connection = connections().logs;
  }
  async create(logs) {
    const data = logs.map((log) => {
      // Operation: "",
      return {
        Message: log.message,
        Status: log.type,
      };
    });

    await this.#connection.insert(data).into("Calc_Et0");
  }
}
