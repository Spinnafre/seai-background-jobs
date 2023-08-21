import { equipments } from "../connection.js";

export class MetereologicalEquipmentDao {
  #connection;
  
  constructor() {
    this.#connection = equipments();
  }

  async getPluviometers(organName = null) {
    let pluviometers = []

    if (organName) {
      pluviometers = await this.#connection
        .raw(`
        SELECT
          me."IdEquipment" AS "Id",
          me."IdEquipmentExternal" AS "code",
          me."Name" AS "Location",
          me."Altitude",
          et."Name" AS "Type",
          mo."Name" AS "Organ"
        FROM
          "MetereologicalEquipment" me
          INNER JOIN "EquipmentType" et ON et."IdType" = me."FK_Type"
          INNER JOIN "MetereologicalOrgan" mo ON mo."IdOrgan" = me."FK_Organ"
        WHERE
          mo."Name" = ? AND et."Name" = 'pluviometer'
        `, [organName])
    } else {
      pluviometers = await this.#connection
        .raw(`
        SELECT
          me."IdEquipment" AS "Id",
          me."IdEquipmentExternal" AS "code",
          me."Name" AS "Location",
          me."Altitude",
          et."Name" AS "Type",
          mo."Name" AS "Organ"
        FROM
          "MetereologicalEquipment" me
          INNER JOIN "EquipmentType" et ON et."IdType" = me."FK_Type"
          INNER JOIN "MetereologicalOrgan" mo ON mo."IdOrgan" = me."FK_Organ"
        WHERE
          et."Name" = 'pluviometer'
        `)
    }

    return pluviometers.map((station) => {
      return {
        id: station.Id,
        code: station.Code,
        location: station.Location,
        altitude: station.Altitude,
        type: station.Type,
        organ: station.Organ
      }
    });
  }

  async getStations(organName = null) {
    let stations = []

    if (organName) {
      stations = await this.#connection
        .raw(`
        SELECT
          me."IdEquipment" AS "Id",
          me."IdEquipmentExternal" AS "code",
          me."Name" AS "Location",
          me."Altitude",
          et."Name" AS "Type",
          mo."Name" AS "Organ"
        FROM
          "MetereologicalEquipment" me
          INNER JOIN "EquipmentType" et ON et."IdType" = me."FK_Type"
          INNER JOIN "MetereologicalOrgan" mo ON mo."IdOrgan" = me."FK_Organ"
        WHERE
          mo."Name" = ? AND et."Name" = 'station'
        `, [organName])
    } else {
      stations = await this.#connection
        .raw(`
            SELECT
              me."IdEquipment" AS "Id",
              me."IdEquipmentExternal" AS "Code",
              me."Name" AS "Location",
              me."Altitude",
              et."Name" AS "Type",
              mo."Name" AS "Organ"
            FROM
              "MetereologicalEquipment" me
              INNER JOIN "EquipmentType" et ON et."IdType" = me."FK_Type"
              INNER JOIN "MetereologicalOrgan" mo ON mo."IdOrgan" = me."FK_Organ"
            WHERE
              et."Name" = 'station'`)
    }


    return stations.map((station) => {
      return {
        id: station.Id,
        code: station.Code,
        location: station.Location,
        altitude: station.Altitude,
        type: station.Type,
        organ: station.Organ
      }
    });
  }
}
