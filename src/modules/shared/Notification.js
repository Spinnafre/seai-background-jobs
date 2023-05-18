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
      type: "Warning",
      message,
    });
  }

  addErrorLog(message) {
    this.#notifications.push({
      type: "Error",
      message,
    });
  }

  addInfoLog(message) {
    this.#notifications.push({
      type: "Success",
      message,
    });
  }

  getLogs() {
    return this.#notifications;
  }
}
