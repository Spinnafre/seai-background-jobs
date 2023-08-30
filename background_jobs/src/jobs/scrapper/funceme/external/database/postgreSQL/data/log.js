import { logsConnection } from "../logs-connection.js";

export class LogRepository {
  connection;
  constructor() {
    this.connection = logsConnection();
  }
  async create(logs) {
    let data;

    if (Array.isArray(logs)) {
      data = logs.length
        ? logs.map((log) => {
            return {
              Message: log.message,
              Operation: "",
              Status: log.type,
            };
          })
        : null;
    } else {
      data = {
        Message: logs.message,
        Operation: "",
        Status: logs.type,
      };
    }

    if (data !== null) {
      await this.connection.insert(data).into("Funceme_Data_Miner");
    }
  }
}
