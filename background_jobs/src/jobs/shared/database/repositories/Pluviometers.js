import { connections } from "../connection.js";
export class PluviometerReadRepository {
  connection;
  constructor() {
    this.connection = connections.equipments;
  }
  async getPluviometersReadsByDate(idEqp, idOrgan, date) {
    const data = await this.#connection.raw(
      `
      SELECT
        read."IdRead",
        CAST(read."Time" AS DATE)
      FROM
        "ReadPluviometers" as read
      WHERE
        CAST(read."Time" AS DATE) = ?
        AND read."FK_Organ" = ?
        AND read."FK_Equipment" = ?
      `,
      [date, idOrgan, idEqp]
    );

    if (!data) {
      return null;
    }

    return data.rows.map((read) => {
      return {
        idRead: read.IdRead,
        time: read.Time,
      };
    });
  }
  async deleteByTime(time) {
    await this.#connection.raw(
      `delete from "ReadPluviometers" as rs
where cast(rs."Time" as DATE) = ?`,
      [time]
    );
  }
  async create(measures = []) {
    const created = await this.connection
      .returning(["IdRead", "Time"])
      .insert(measures)
      .into("ReadPluviometers");

    return created.map((read) => ({
      idRead: read.IdRead,
      date: read.Time,
    }));
  }
}
