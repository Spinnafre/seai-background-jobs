import { connections } from "../connection.js";

export class LogRepository {
  #connection;

  constructor() {
    this.#connection = connections.logs;
  }
  async create({ logs, tableName }) {
    await this.#connection.insert(logs).into(tableName);
  }
}
