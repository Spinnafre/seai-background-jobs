import { EquipmentMapper } from "../../../../../core/mappers/equipments-mapper.js";

import { equipmentConnection } from "../equipments-connections.js";

export class MetereologicalEquipmentDao {
  connection;
  constructor() {
    this.connection = equipmentConnection();
  }
  async getFuncemeStations() {
    const stations = await this.connection
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
    const codes = items.map((eqp) => eqp.IdEquipmentExternal);

    return {
      equipments: EquipmentMapper.equipmentsToDomain(items),
      codes,
    };
  }

  async getFuncemePluviometers() {
    const stations = await this.connection
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

    const codes = items.map((eqp) => eqp.IdEquipmentExternal);

    return {
      equipments: EquipmentMapper.equipmentsToDomain(items),
      codes,
    };
  }

  async getInmetPluviometers() {
    const pluviometers = await this.connection
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
      equipments: EquipmentMapper.equipmentsToDomain(items),
      codes,
    };
  }
  async getInmetStations() {
    const stations = await this.connection
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
      equipments: EquipmentMapper.equipmentsToDomain(items),
      codes,
    };
  }
}
