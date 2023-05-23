import { Mapper } from "../../../../core/mappers/mapper.js";

export class MetereologicalEquipmentDao {
  #connection;
  constructor(connection) {
    this.#connection = connection;
  }

  async getFuncemeStations() {
    const pluviometers = await this.#connection
      .select()
      .where({
        Type: "station",
        Organ: "FUNCEME",
      })
      .from("MetereologicalEquipment")
      .innerJoin(
        "EquipmentType",
        "MetereologicalEquipment.FK_Type",
        "=",
        "EquipmentType.IdType"
      );

    return Mapper.equipmentsToDomain(pluviometers);
  }

  async getFuncemePluviometers() {
    const pluviometers = await this.#connection
      .select()
      .where({
        Type: "station",
        Organ: "FUNCEME",
      })
      .from("MetereologicalEquipment");

    return Mapper.equipmentsToDomain(pluviometers);
  }

  async getInmetPluviometers() {
    const pluviometers = await this.#connection
      .select(
        "MetereologicalEquipment.Name as Name",
        "EquipmentType.Name as Type",
        "MetereologicalEquipment.IdEquipment",
        "MetereologicalEquipment.IdEquipmentExternal",
        "MetereologicalEquipment.Altitude",
        "MetereologicalEquipment.CreatedAt",
        "MetereologicalEquipment.UpdatedAt",
        "MetereologicalEquipment.FK_Organ",
        "MetereologicalOrgan.Name as Organ"
      )
      .from("MetereologicalEquipment")
      .innerJoin(
        "EquipmentType",
        "MetereologicalEquipment.FK_Type",
        "=",
        "EquipmentType.IdType"
      )
      .innerJoin(
        "MetereologicalOrgan",
        "MetereologicalOrgan.IdOrgan",
        "=",
        "MetereologicalEquipment.FK_Organ"
      );
    const items = pluviometers.filter(
      (eqp) => eqp.Type === "pluviometer" && eqp.Organ === "INMET"
    );
    const codes = items.map((eqp) => eqp.IdEquipmentExternal);
    return {
      equipments: Mapper.equipmentsToDomain(items),
      codes,
    };
  }
  async getInmetStations() {
    const stations = await this.#connection
      .select(
        "MetereologicalEquipment.Name as Name",
        "EquipmentType.Name as Type",
        "MetereologicalEquipment.IdEquipment",
        "MetereologicalEquipment.IdEquipmentExternal",
        "MetereologicalEquipment.Altitude",
        "MetereologicalEquipment.CreatedAt",
        "MetereologicalEquipment.UpdatedAt",
        "MetereologicalEquipment.FK_Organ",
        "MetereologicalOrgan.Name as Organ"
      )
      .from("MetereologicalEquipment")
      .innerJoin(
        "EquipmentType",
        "MetereologicalEquipment.FK_Type",
        "=",
        "EquipmentType.IdType"
      )
      .innerJoin(
        "MetereologicalOrgan",
        "MetereologicalOrgan.IdOrgan",
        "=",
        "MetereologicalEquipment.FK_Organ"
      );

    const items = stations.filter(
      (eqp) => eqp.Type === "station" && eqp.Organ === "INMET"
    );

    const codes = items.map((eqp) => eqp.IdEquipmentExternal);

    console.log("STATIONS = ", items);
    return {
      equipments: Mapper.equipmentsToDomain(items),
      codes,
    };
  }
}
