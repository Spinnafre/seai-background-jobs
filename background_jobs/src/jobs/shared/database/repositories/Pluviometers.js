import { connections } from "../connection.js";
export class PluviometerReadRepository {
  connection;
  constructor() {
    this.connection = connections.equipments;
  }
  async create(measures = []) {
    await this.connection.insert(measures).into("ReadPluviometers");
  }
}
