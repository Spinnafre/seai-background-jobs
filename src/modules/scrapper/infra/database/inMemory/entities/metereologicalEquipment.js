import { Mapper } from "../../../../core/mappers/mapper.js";

export class MetereologicalEquipmentInMemory {
  #MetereologicalEquipment = [];

  async createMetereologicalEquipment(data = []) {
    this.#MetereologicalEquipment = data;
  }

  async getFuncemeStations() {
    const stations = this.#MetereologicalEquipment.filter(
      (eqp) => eqp.Type.Name == "station" && eqp.Organ.Name === "FUNCEME"
    );

    return Mapper.equipmentsToDomain(stations);
  }

  async getFuncemePluviometers() {
    const pluviometers = this.#MetereologicalEquipment.filter(
      (eqp) => eqp.Type.Name == "pluviometer" && eqp.Organ.Name === "FUNCEME"
    );

    return Mapper.equipmentsToDomain(pluviometers);
  }
  async getInmetEquipments() {
    const data = this.#MetereologicalEquipment.filter(
      (eqp) => eqp.Organ.Name === "INMET"
    );
    return Mapper.equipmentsToDomain(data);
  }
}
