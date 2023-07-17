import { equipment_connection } from "../equipments-connections.js";

export class PluviometerReadDao {
  async create(measures = []) {
    await equipment_connection.insert(measures).into("ReadPluviometers");
  }
}
