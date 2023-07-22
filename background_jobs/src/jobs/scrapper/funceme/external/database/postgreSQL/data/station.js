import { equipment_connection } from "../equipments-connections.js";

export class StationReadDao {
  async create(measures = []) {
    console.log(measures);
    await equipment_connection.insert(measures).into("ReadStations");
  }
}
