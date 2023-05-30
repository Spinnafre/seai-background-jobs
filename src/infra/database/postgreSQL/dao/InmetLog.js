export class InmetLog {
  #connection;
  constructor(connection) {
    this.#connection = connection;
  }
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

    await this.#connection.insert(data).into("Inmet_Data_Miner");
  }
}
