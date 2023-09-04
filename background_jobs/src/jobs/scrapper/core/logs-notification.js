import { Logger } from "../../../lib/logger/logger.js";

export class Notification {
  #notifications;
  constructor() {
    this.#notifications = [];
  }

  hasNotifications() {
    return this.#notifications.length > 0;
  }

  addWarningLog(message) {
    Logger.warn({
      msg: message,
    });
    this.#notifications.push({
      type: "warning",
      message,
    });
  }

  addErrorLog(message) {
    Logger.error({
      msg: message,
    });
    this.#notifications.push({
      type: "error",
      message,
    });
  }

  addInfoLog(message) {
    Logger.info({
      msg: message,
    });
    this.#notifications.push({
      type: "info",
      message,
    });
  }

  getLogs() {
    return this.#notifications;
  }
}
