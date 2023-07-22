import { equipments } from "../connection.js";

export class LocationDao {
  #connection;
  constructor() {
    this.#connection = equipments();
  }
}
