import { Mapper } from "../../../core/mapper/map.js";

export class MetereologicalEquipmentInMemory {
  #MetereologicalEquipment = [];

  async createMetereologicalEquipment(data = []) {
    this.#MetereologicalEquipment = data;
  }

  async getFuncemeStations() {
    const stations = this.#MetereologicalEquipment.filter(
      (eqp) => eqp.Type.Name == "station" && eqp.Organ.Name === "FUNCEME"
    );

    return Mapper.stationsToDomain(stations);
  }

  async getFuncemePluviometers() {
    const pluviometers = this.#MetereologicalEquipment.filter(
      (eqp) => eqp.Type.Name == "pluviometer" && eqp.Organ.Name === "FUNCEME"
    );

    return Mapper.pluviometersToDomain(pluviometers);
  }

  async getInmetStations() {
    const stations = this.#MetereologicalEquipment.filter(
      (eqp) => eqp.Type.Name == "station" && eqp.Organ.Name === "INMET"
    );
    return Mapper.stationsToDomain(stations);
  }

  async getInmetPluviometers() {
    const pluviometers = this.#MetereologicalEquipment.filter(
      (eqp) => eqp.Type.Name == "pluviometer" && eqp.Organ.Name === "INMET"
    );
    return Mapper.pluviometersToDomain(pluviometers);
  }
}
