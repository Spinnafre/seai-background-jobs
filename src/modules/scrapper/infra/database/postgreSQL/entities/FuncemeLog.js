export class FuncemeLog {
  #connection;
  constructor(connection){
    this.#connection = connection
  }

  async create(logs = []) {
    await this.#connection("Funceme_Data_Miner").insert(logs)
  }
}
