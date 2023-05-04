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
    return this.#MetereologicalEquipment.filter(
      (eqp) => eqp.Type.Name == nameType && eqp.Organ.Name === "FUNCEME"
    );
  }

  async getInmetEquipmentByType(nameType) {
    return this.#MetereologicalEquipment.filter(
      (eqp) => eqp.Type.Name == nameType && eqp.Organ.Name === "INMET"
    );
  }
}
