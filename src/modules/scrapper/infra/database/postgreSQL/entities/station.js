export class StationReadDao {
  #connection;
  constructor(connection) {
    this.#connection = connection;
  }
  async create(measures = []) {
    await this.#connection.insert(measures).into("ReadStations");
  }
}
