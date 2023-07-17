import { equipments } from "../connection.js";

export class PluviometerDao {
  #connection;
  constructor() {
    this.#connection = equipments();
  }

  async getPluviometerByTime(date) {
    const measure = await this.#connection
      .select()
      .where({
        Time: date,
      })
      .first()
      .from("ReadPluviometers");

    return measure;
  }
}
