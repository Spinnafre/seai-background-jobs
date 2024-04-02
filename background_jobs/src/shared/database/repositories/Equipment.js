import { connections } from "../connection.js";
import { geoLocationExtension } from "../geolocation.js";

export class MetereologicalEquipmentRepository {
  #connection;

  constructor(connection) {
    this.#connection = connections.equipments;
  }

  async insertOrgan(organ) {
    const result = await this.#connection
      .insert({
        Name: organ.Name,
        Host: organ.Host || null,
        User: organ.User || null,
        Password: organ.Password || null,
      })
      .into("MetereologicalOrgan")
      .returning("IdOrgan");

    return result.map((data) => data.IdOrgan);
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
          ST_AsGeoJSON(
              equipment."Location"::geometry
          )::json AS "GeoLocation",
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
          ST_AsGeoJSON(
              equipment."Location"::geometry
          )::json AS "GeoLocation",
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
        Id: eqp.Id,
        Code: eqp.Code,
        Location: eqp.Location,
        Altitude: eqp.Altitude,
        Location: eqp.GeoLocation ? eqp.GeoLocation["coordinates"] : null,
        Type: eqp.Type,
        Organ: eqp.Organ,
        Id_Organ: eqp.Organ_Id,
      };
    });
  }

  async getOrganByName(organName) {
    const result = await this.#connection
      .select("IdOrgan", "Host", "User", "Password")
      .from("MetereologicalOrgan")
      .where({ Name: organName })
      .first();

    if (result) {
      return {
        Id: result.IdOrgan,
        Host: result.Host,
        User: result.User,
        Password: result.Password,
      };
    }

    return null;
  }

  async getTypes() {
    const type = new Map();

    const result = await this.#connection
      .select("IdType", "Name")
      .from("EquipmentType");

    result.forEach((raw) => {
      type.set(raw.Name, raw.IdType);
    });

    return type;
  }

  async create(equipments = []) {
    const insertedEquipments = new Map();

    const st = geoLocationExtension(this.#connection);

    await this.#connection.transaction(async (trx) => {
      // TO-DO: how insert coordinates?
      // TO-DO: how measurements?
      const eqps = await trx
        .batchInsert(
          "MetereologicalEquipment",
          equipments.map((equipment) => {
            return {
              IdEquipmentExternal: equipment.IdEquipmentExternal,
              Name: equipment.Name,
              Altitude: equipment.Altitude,
              // Location: st.geomFromText("Point(-71.064544 44.28787)"),
              Location: st.geomFromText(
                `Point(${equipment.Location.Latitude} ${equipment.Location.Longitude})`
              ),
              FK_Organ: equipment.FK_Organ,
              FK_Type: equipment.FK_Type,
              Enable: equipment.Enabled,
              CreatedAt: this.#connection.fn.now(),
            };
          })
        )
        .returning(["IdEquipment", "IdEquipmentExternal"]);

      // [ { IdEquipment: 1 }, { IdEquipment: 2 } ]
      eqps.forEach((eqp) =>
        insertedEquipments.set(eqp.IdEquipmentExternal, eqp.IdEquipment)
      );
    });

    return insertedEquipments;
  }

  async insertStationsMeasurements(measurements = []) {
    await this.#connection.transaction(async (trx) => {
      await trx.batchInsert(
        "ReadStations",
        measurements.map((measures) => {
          return {
            FK_Equipment: measures.FK_Equipment,
            FK_Organ: measures.FK_Organ,
            Time: measures.Time,
            Hour: measures.Hour,
            TotalRadiation: measures.TotalRadiation,
            MaxRelativeHumidity: measures.MaxRelativeHumidity,
            MinRelativeHumidity: measures.MinRelativeHumidity,
            AverageRelativeHumidity: measures.AverageRelativeHumidity,
            MaxAtmosphericTemperature: measures.MaxAtmosphericTemperature,
            MinAtmosphericTemperature: measures.MinAtmosphericTemperature,
            AverageAtmosphericTemperature:
              measures.AverageAtmosphericTemperature,
            AtmosphericPressure: measures.AtmosphericPressure,
            WindVelocity: measures.WindVelocity,
            Et0: measures.Et0,
          };
        })
      );
    });
  }

  async insertPluviometersMeasurements(measurements = []) {
    await this.#connection.transaction(async (trx) => {
      await trx.batchInsert(
        "ReadPluviometers",
        measurements.map((eqp) => {
          return {
            FK_Equipment: eqp.FK_Equipment,
            FK_Organ: eqp.FK_Organ,
            Time: eqp.Time,
            Hour: eqp.Hour,
            Value: eqp.Value,
          };
        })
      );
    });
  }
}
