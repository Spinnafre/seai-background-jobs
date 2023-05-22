export class PluviometerReadDao {
  #connection
  constructor(connection){
    this.#connection = connection
  }
  
  async create(measures=[]) {
    await this.#connection("ReadPluviometers").insert(measures)
  }
}
