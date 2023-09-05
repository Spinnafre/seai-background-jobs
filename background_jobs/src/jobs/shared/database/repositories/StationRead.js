import { connections } from "../connection.js";

export class StationReadRepository {
  #connection;
  constructor() {
    this.#connection = connections.equipments;
  }

  async getStationsReadsByDate(idEqp, idOrgan, date) {
    const data = await this.#connection.raw(
      `
      SELECT
        read."IdRead",
        CAST(read."Time" AS DATE)
      FROM
        "ReadStations" as read
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

    return data.rows.map((stationRead) => {
      return {
        idRead: stationRead.IdRead,
        time: stationRead.Time,
      };
    });
  }

  async getStationReadsByEquipment(idEqp) {
    const data = await this.#connection
      .select()
      .where({
        FK_Equipment: idEqp,
      })
      .from("ReadStations");

    if (!data) {
      return null;
    }

    return data.map((stationRead) => {
      return {
        idRead: stationRead.IdRead,
        totalRadiation: stationRead.TotalRadiation,
        relativeHumidity: stationRead.RelativeHumidity,
        atmosphericTemperature: stationRead.AtmosphericTemperature,
        windVelocity: stationRead.WindVelocity,
      };
    });
  }
  async deleteByTime(time) {
    await this.#connection.raw(
      `delete from "ReadStations" as rs
where cast(rs."Time" as DATE) = ?`,
      [time]
    );
  }
  async create(measures = []) {
    const created = await this.#connection
      .returning(["IdRead", "Time"])
      .insert(measures)
      .into("ReadStations");

    return created.map((read) => ({
      idRead: read.IdRead,
      date: read.Time,
    }));
  }
}
