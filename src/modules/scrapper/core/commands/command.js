import { Notification } from "../../utils/index.js";

export class Command {
  #logs;
  constructor() {
    this.#params = null;
    this.#logs = new Notification();
  }

  getLogs() {
    return this.#logs.getLogs();
  }

  async execute(params) {
    throw new Error("Command method not implemented");
  }
}
