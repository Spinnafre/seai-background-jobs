import { EquipmentMapper } from "../../../../../src/workers/Scrapper/core/mappers/equipments-mapper.js";

export class MetereologicalEquipmentInMemory {
  #MetereologicalEquipment = [];

  async createMetereologicalEquipment(data = []) {
    this.#MetereologicalEquipment = data;
  }

  async getFuncemeStations() {
    const stations = this.#MetereologicalEquipment.filter(
      (eqp) => eqp.Type == "station" && eqp.Organ === "FUNCEME"
    );

    return EquipmentMapper.equipmentsToDomain(stations);
  }

  async getFuncemePluviometers() {
    const pluviometers = this.#MetereologicalEquipment.filter(
      (eqp) => eqp.Type == "pluviometer" && eqp.Organ === "FUNCEME"
    );

    return EquipmentMapper.equipmentsToDomain(pluviometers);
  }

  async getInmetStations() {
    const data = this.#MetereologicalEquipment.filter(
      (eqp) => eqp.Type == "station" && eqp.Organ === "INMET"
    );

    const equipments = EquipmentMapper.equipmentsToDomain(data);

    const codes = equipments.map((eqp) => eqp.code);

    return {
      equipments,
      codes,
    };
  }

  async getInmetPluviometers() {
    const data = this.#MetereologicalEquipment.filter(
      (eqp) => eqp.Type == "pluviometer" && eqp.Organ === "INMET"
    );
    const equipments = EquipmentMapper.equipmentsToDomain(data);

    const codes = equipments.map((eqp) => eqp.code);

    return {
      equipments,
      codes,
    };
  }
}
