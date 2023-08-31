import equipmentConnection from "../../../scrapper/funceme/external/database/postgreSQL/equipments-connections.js";

export class PluviometerReadRepository {
  connection;
  constructor() {
    this.connection = equipmentConnection;
  }
  async create(measures = []) {
    await this.connection.insert(measures).into("ReadPluviometers");
  }
}
