export class Notification {
  #notifications;
  constructor() {
    this.#notifications = [];
  }

  hasNotifications() {
    return this.#notifications.length > 0;
  }

  addWarningLog(message) {
    this.#notifications.push({
      type: "warning",
      message,
    });
  }

  addErrorLog(message) {
    this.#notifications.push({
      type: "error",
      message,
    });
  }

  addInfoLog(message) {
    this.#notifications.push({
      type: "info",
      message,
    });
  }

  getLogs() {
    return this.#notifications;
  }
}
