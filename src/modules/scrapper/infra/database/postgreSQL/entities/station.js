export class StationReadDao {
  #connection
  constructor(connection){
    this.#connection = connection
  }
  async create(measures=[]) {
    await this.#connection("ReadStations").insert(measures)
  }
}
