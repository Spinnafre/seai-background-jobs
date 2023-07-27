import { logs_connection } from "../logs-connection.js";

export class LogRepository {
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
      await logs_connection.insert(data).into("Funceme_Data_Miner");
    }
  }
}
