import { Mapper } from "../../../../core/mappers/mapper.js";

export class MetereologicalEquipmentInMemory {
  #MetereologicalEquipment = [];

  async createMetereologicalEquipment(data = []) {
    this.#MetereologicalEquipment = data;
  }

  async getFuncemeStations() {
    const stations = this.#MetereologicalEquipment.filter(
      (eqp) => eqp.Type == "station" && eqp.Organ === "FUNCEME"
    );

    return Mapper.equipmentsToDomain(stations);
  }

  async getFuncemePluviometers() {
    const pluviometers = this.#MetereologicalEquipment.filter(
      (eqp) => eqp.Type == "pluviometer" && eqp.Organ === "FUNCEME"
    );

    return Mapper.equipmentsToDomain(pluviometers);
  }

  async getInmetStations() {
    const data = this.#MetereologicalEquipment.filter(
      (eqp) => eqp.Type == "station" && eqp.Organ === "INMET"
    );

    const equipments = Mapper.equipmentsToDomain(data);

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
    const equipments = Mapper.equipmentsToDomain(data);

    const codes = equipments.map((eqp) => eqp.code);

    return {
      equipments,
      codes,
    };
  }
}
