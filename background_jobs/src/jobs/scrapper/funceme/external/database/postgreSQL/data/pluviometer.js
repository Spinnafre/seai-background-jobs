import { equipmentConnection } from "../equipments-connections.js";

export class PluviometerReadDao {
  connection;
  constructor() {
    this.connection = equipmentConnection();
  }
  async create(measures = []) {
    await this.connection.insert(measures).into("ReadPluviometers");
  }
}
