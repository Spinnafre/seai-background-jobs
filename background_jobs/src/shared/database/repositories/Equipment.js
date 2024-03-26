import { connections } from "../connection.js";

export class MetereologicalEquipmentRepository {
  #connection;

  constructor() {
    this.#connection = connections.equipments;
  }

  async getEquipments({ organName = null, eqpType = "" }) {
    let equipments = [];

    if (organName) {
      equipments = await this.#connection.raw(
        `
        SELECT
          equipment."IdEquipment" AS "Id",
          equipment."IdEquipmentExternal" AS "Code",
          equipment."Name" AS "Location",
          equipment."Altitude",
          eqp_type."Name" AS "Type",
          organ."Name" AS "Organ",
          organ."IdOrgan" AS "Organ_Id"
        FROM
          "MetereologicalEquipment" equipment
        INNER JOIN "EquipmentType" eqp_type ON eqp_type."IdType" = equipment."FK_Type"
        INNER JOIN "MetereologicalOrgan" organ ON organ."IdOrgan" = equipment."FK_Organ"
        WHERE
          organ."Name" = ? AND eqp_type."Name" = ?
        `,
        [organName, eqpType]
      );
    } else {
      equipments = await this.#connection.raw(
        `
        SELECT
          equipment."IdEquipment" AS "Id",
          equipment."IdEquipmentExternal" AS "Code",
          equipment."Name" AS "Location",
          equipment."Altitude",
          eqp_type."Name" AS "Type",
          organ."Name" AS "Organ",
          organ."IdOrgan" AS "Organ_Id"
        FROM
          "MetereologicalEquipment" equipment
        INNER JOIN "EquipmentType" eqp_type ON eqp_type."IdType" = equipment."FK_Type"
        INNER JOIN "MetereologicalOrgan" organ ON organ."IdOrgan" = equipment."FK_Organ"
        WHERE
          eqp_type."Name" = ?
        `,
        [eqpType]
      );
    }

    return equipments.rows.map((eqp) => {
      return {
        id: eqp.Id,
        code: eqp.Code,
        location: eqp.Location,
        altitude: eqp.Altitude,
        type: eqp.Type,
        organ: eqp.Organ,
        id_organ: eqp.Organ_Id,
      };
    });
  }

  async create(equipments = []) {
    await this.#connection.transaction(async (trx) => {
      // TO-DO: how insert coordinates?
      // TO-DO: how measurements?
      const ids = await trx.batchInsert(
        "MetereologicalEquipment",
        equipments.map((equipment) => {
          return {
            IdEquipmentExternal: equipment.IdEquipmentExternal,
            Name: equipment.Name,
            Altitude: equipment.Altitude,
            FK_Organ: equipment.Fk_Organ,
            FK_Type: equipment.Fk_Type,
            Enable: equipment.Enable,
            CreatedAt: this.#connection.fn.now(),
          };
        })
      );

      console.log("[REPOSITORY  ]", ids);
    });
  }
}
