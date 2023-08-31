import equipmentConnection from "../equipments-connections.js";

export class StationReadDao {
  connection;
  constructor() {
    this.connection = equipmentConnection;
  }
  async create(measures = []) {
    await this.connection.insert(measures).into("ReadStations");
  }
}
