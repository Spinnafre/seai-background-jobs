import { connections } from "../connection.js";

export class ET0Repository {
  #connection;
  constructor() {
    this.#connection = connections.equipments;
  }

  async deleteByTime(time) {
    await this.#connection.raw(
      `delete from "Et0" as rs
where cast(rs."Time" as DATE) = ?`,
      [time]
    );
  }
  async add(reads = []) {
    const toPersistency = reads.map((read) => {
      return {
        Value: read.eto,
        FK_Station_Read: read.idRead,
      };
    });

    await this.#connection.insert(toPersistency).into("Et0");
  }
}
