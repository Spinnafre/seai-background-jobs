export class InmetLog {
  #connection;
  constructor(connection) {
    this.#connection = connection;
  }
  async create(logs = []) {
    const data = logs.map((log) => {
      return {
        Status: "info",
        Message: log.message,
        Operation: "",
      };
    });
    console.log("LOGS => ", data);
    await this.#connection.insert(data).into("Inmet_Data_Miner");
  }
}
