import { EquipmentMapper } from "../../../../../src/jobs/scrapper/core/mappers/equipments-mapper.js";

export class MetereologicalEquipmentInMemory {
  #MetereologicalEquipment;

  constructor(data = []) {
    this.#MetereologicalEquipment = data.length ? data : [];
  }

  async createMetereologicalEquipment(data) {
    this.#MetereologicalEquipment.push(data);
  }

  async getStations(organName = "") {
    let stations = [];

    if (organName) {
      stations = this.#MetereologicalEquipment.filter(
        (eqp) => eqp.Type == "station" && eqp.Organ === organName
      );
    } else {
      stations = this.#MetereologicalEquipment.filter(
        (eqp) => eqp.Type == "station"
      );
    }

    return stations.map((station) => {
      return {
        id: station.IdEquipment,
        code: station.IdEquipmentExternal,
        location: "test",
        altitude: station.Altitude,
        type: station.Type,
        organ: station.Organ,
      };
    });
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
