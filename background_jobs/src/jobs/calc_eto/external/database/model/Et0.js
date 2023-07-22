import { equipments } from "../connection.js";

export class ET0Dao {
  #connection;
  constructor() {
    this.#connection = equipments();
  }

  async create(id, value) {
    await this.#connection
      .insert({
        Value: value,
        FK_Station_Read: id,
      })
      .into("Et0");
  }
}
