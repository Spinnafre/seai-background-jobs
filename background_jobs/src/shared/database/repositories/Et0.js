import { connections } from "../connection.js";

export class ET0Repository {
  #connection;
  constructor() {
    this.#connection = connections.equipments;
  }

  // Date string YYYY-MM-DD
  async deleteByTime(date) {
    const rawReads = await this.#connection.raw(
      `SELECT e."FK_Station_Read" , rs."Time"  FROM "Et0" e 
        INNER JOIN "ReadStations" rs 
        ON rs."IdRead" = e."FK_Station_Read"
        WHERE rs."Time" = ?`,
      [date]
    );

    if (!rawReads || rawReads.rows.length === 0) {
      return;
    }

    const toDelete = rawReads.rows.map((raw) => raw.FK_Station_Read);

    await this.#connection("Et0").delete().whereIn("FK_Station_Read", toDelete);
  }
  async add(reads = []) {
    const toPersistency = reads.map((read) => {
      return {
        Value: read.eto,
        FK_Station_Read: read.idRead,
      };
    });
    console.log("Saving ETO ", { toPersistency });
    await this.#connection.insert(toPersistency).into("Et0");
  }
}
