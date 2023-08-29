export class LogsRepositoryInMemory {
  logs = [];
  async create(logs) {
    let data;

    if (typeof logs === "string") {
      data = {
        Message: logs.message,
        Operation: "",
        Status: logs.type,
      };
      this.logs.push(data);
    } else {
      data = logs.map((log) => {
        return {
          Message: log.message,
          Operation: "",
          Status: log.type,
        };
      });
      this.logs = [...this.logs, ...data];
    }
  }
}
