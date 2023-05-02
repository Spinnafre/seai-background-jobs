export class MetereologicalEquipmentInMemory {
  #MetereologicalEquipment = [];
  #EquipmentLocation = [
    {
      IdLocation: "",
      Location: "",
      Name: "",
      FK_Equipment: "",
    },
  ];

  async createMetereologicalEquipment(data = []) {
    this.#MetereologicalEquipment = data;
  }

  async getFuncemeEquipmentByType(nameType) {
    const equipment = this.#MetereologicalEquipment.filter(
      (eqp) => eqp.Type.Name == nameType && eqp.Organ.Name === "FUNCEME"
    );

    return equipment;
  }

  async getInmetEquipmentByType(nameType) {
    const equipment = this.#MetereologicalEquipment.filter(
      (eqp) => eqp.Type.Name == nameType && eqp.Organ.Name === "INMET"
    );
    return equipment;
  }
}
