import { Logger } from "../../../shared/logger.js";

export class Notification {
  #notifications;
  constructor() {
    this.#notifications = [];
  }

  hasNotifications() {
    return this.#notifications.length > 0;
  }

  _add({ message, type, raw }) {
    const logMessage = {
      type,
      message,
    };

    if (raw) {
      Object.assign(logMessage, {
        raw,
      });
    }

    this.#notifications.push(logMessage);
  }

  addWarningLog({ message, raw = undefined }) {
    Logger.warn({
      msg: message,
    });

    this._add({
      type: "warning",
      message,
      raw,
    });
  }

  addErrorLog({ message, raw = undefined }) {
    Logger.error({
      msg: message,
    });

    this._add({
      type: "error",
      message,
      raw,
    });
  }

  addInfoLog({ message, raw = undefined }) {
    Logger.info({
      msg: message,
    });

    this._add({
      type: "info",
      message,
      raw,
    });
  }

  getLogs() {
    return this.#notifications;
  }
}
