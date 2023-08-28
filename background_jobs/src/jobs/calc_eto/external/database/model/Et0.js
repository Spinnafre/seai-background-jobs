import { connections } from "../connection.js";

export class ET0Repository {
  #connection;
  constructor() {
    this.#connection = connections.equipments;
  }

  async add(reads = []) {
    const toPersistency = reads.map((read) => {
      return {
        Value: read.eto,
        FK_Station_Read: read.idRead,
      };
    });

    console.log("Data to insert = ", toPersistency);

    await this.#connection.insert(toPersistency).into("Et0");
  }
}
