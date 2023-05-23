export class PluviometerReadDao {
  #connection;
  constructor(connection) {
    this.#connection = connection;
  }

  async create(measures = []) {
    await this.#connection.insert(measures).into("ReadPluviometers");
  }
}
