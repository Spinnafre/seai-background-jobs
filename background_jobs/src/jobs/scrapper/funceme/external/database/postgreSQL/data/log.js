import { logs_connection } from "../logs-connection.js";

export class LogRepository {
  async create(logs) {
    let data;

    if (typeof logs === "string") {
      data = {
        Message: logs.message,
        Operation: "",
        Status: logs.type,
      };
    } else {
      data = logs.map((log) => {
        return {
          Message: log.message,
          Operation: "",
          Status: log.type,
        };
      });
    }

    await logs_connection.insert(data).into("Funceme_Data_Miner");
  }
}
