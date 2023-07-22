import { equipments } from "../connection.js";

export class StationDao {
  #connection;
  constructor() {
    this.#connection = equipments();
  }

  async getStationByTime(date) {
    const measure = await this.#connection
      .select()
      .where({
        Time: date,
      })
      .first()
      .from("ReadStations");

    return measure;
  }
}
