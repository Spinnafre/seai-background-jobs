import { EquipmentMapper } from "../../../../src/workers/Scrapper/core/mappers/equipments-mapper.js";

export class MetereologicalEquipmentInMemory {
  #MetereologicalEquipment = [];

  async createMetereologicalEquipment(data) {
    this.#MetereologicalEquipment.push(data);
  }

  async getFuncemeStations() {
    const stations = this.#MetereologicalEquipment.filter(
      (eqp) => eqp.Type == "station" && eqp.Organ === "FUNCEME"
    );

    const codes = stations.map((eqp) => eqp.IdEquipmentExternal);

    return { equipments: EquipmentMapper.equipmentsToDomain(stations), codes };
  }

  async getFuncemePluviometers() {
    const pluviometers = this.#MetereologicalEquipment.filter(
      (eqp) => eqp.Type == "pluviometer" && eqp.Organ === "FUNCEME"
    );

    const codes = pluviometers.map((eqp) => eqp.IdEquipmentExternal);

    return {
      equipments: EquipmentMapper.equipmentsToDomain(pluviometers),
      codes,
    };
  }
}
