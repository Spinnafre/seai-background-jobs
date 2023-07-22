import { equipments } from "../connection.js";

export class MetereologicalEquipmentDao {
  #connection;
  constructor() {
    this.#connection = equipments();
  }

  async getFuncemeStations() {
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
      (eqp) => eqp.Type === "station" && eqp.Organ === "FUNCEME"
    );
    console.log("ITEMS =", items);

    return items;
  }

  async getFuncemePluviometers() {
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
      (eqp) => eqp.Type === "pluviometer" && eqp.Organ === "FUNCEME"
    );

    return items;
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

    return items;
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

    return items;
  }
}
