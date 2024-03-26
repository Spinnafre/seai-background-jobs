export class MetereologicalEquipmentRepositoryInMemory {
  #MetereologicalEquipment;

  constructor(data = []) {
    this.#MetereologicalEquipment = data.length ? data : [];
  }

  async create(data = []) {
    this.#MetereologicalEquipment = [...this.#MetereologicalEquipment, ...data];
  }

  async getTypes() {
    return {
      station: 1,
      pluviometer: 2,
    };
  }

  async getOrganByName(organName) {
    return {
      id_organ: 1,
      host: "FUNCEME",
      user: "TEST",
      password: "123",
    };
  }

  async getEquipments({ organName = null, eqpType = "" }) {
    let equipments = [];

    if (organName) {
      equipments = this.#MetereologicalEquipment.filter(
        (eqp) => eqp.Type == eqpType && eqp.Organ === organName
      );
    } else {
      equipments = this.#MetereologicalEquipment.filter(
        (eqp) => eqp.Type == eqpType
      );
    }

    return equipments.map((station) => {
      return {
        id: station.IdEquipment,
        code: station.IdEquipmentExternal,
        location: station.Name,
        altitude: station.Altitude,
        type: station.Type,
        organ: station.Organ,
        id_organ: station.Organ_Id,
      };
    });
  }
}
