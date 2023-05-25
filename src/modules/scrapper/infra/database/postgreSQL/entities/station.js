export class StationReadDao {
  #connection;
  constructor(connection) {
    this.#connection = connection;
  }
  async create(measures = []) {
    console.log(measures);
    await this.#connection.insert(measures).into("ReadStations");
  }
}
