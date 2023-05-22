export class InmetLog {
  #connection;
  constructor(connection){
    this.#connection = connection
  }
  async create(logs = []) {
    await this.#connection("Inmet_Data_Miner").insert(logs)
  }
}
