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

  async getStationReads({ idEqp, date, hour }) {
    const whereSQL = {
      FK_Equipment: idEqp,
      Time: date,
    };

    if (hour) {
      Object.assign(whereSQL, {
        Hour: hour,
      });
    }

    const data = await this.#connection
      .select()
      .where(whereSQL)
      .from("ReadStations");

    if (!data) {
      return null;
    }

    return data.map((stationRead) => {
      return {
        idRead: stationRead.IdRead,
        time: stationRead.Time,
        hour: stationRead.Hour,
        totalRadiation: stationRead.TotalRadiation,
        averageRelativeHumidity: stationRead.AverageRelativeHumidity,
        maxRelativeHumidity: stationRead.MaxRelativeHumidity,
        minRelativeHumidity: stationRead.MinRelativeHumidity,
        averageAtmosphericTemperature:
          stationRead.AverageAtmosphericTemperature,
        minAtmosphericTemperature: stationRead.MinAtmosphericTemperature,
        maxAtmosphericTemperature: stationRead.MaxAtmosphericTemperature,
        atmosphericPressure: stationRead.AtmosphericPressure,
        windVelocity: stationRead.WindVelocity,
      };
    });
  }
  async deleteByTime(time) {
    // yyyy-mm-dd
    await this.#connection.raw(
      `delete from "ReadStations" as rs
where TO_CHAR(rs."Time" :: DATE, 'yyyy-mm-dd') = ?`,
      [time]
    );
  }

  async deleteByDateTime(time, hour) {
    // yyyy-mm-dd
    await this.#connection.raw(
      `delete from "ReadStations" as rs
where TO_CHAR(rs."Time" :: DATE, 'yyyy-mm-dd') = ? 
and rs."Hour" = ?`,
      [time, hour]
    );
  }

  async create(measures = []) {
    const created = await this.#connection("ReadStations")
      .returning(["IdRead", "Time"])
      .insert(measures);

    return created.map((read) => ({
      idRead: read.IdRead,
      date: read.Time,
    }));
  }
}
