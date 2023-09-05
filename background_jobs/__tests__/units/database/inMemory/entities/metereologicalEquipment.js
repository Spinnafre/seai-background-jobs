export class MetereologicalEquipmentInMemory {
  #MetereologicalEquipment;

  constructor(data = []) {
    this.#MetereologicalEquipment = data.length ? data : [];
  }

  async createMetereologicalEquipment(data) {
    this.#MetereologicalEquipment.push(data);
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
        location: "test",
        altitude: station.Altitude,
        type: station.Type,
        organ: station.Organ,
        id_organ: station.Organ_Id,
      };
    });
  }
}
