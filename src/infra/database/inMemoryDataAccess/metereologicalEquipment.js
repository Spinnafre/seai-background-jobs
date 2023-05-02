export class MetereologicalEquipmentInMemory {
  #MetereologicalEquipment = [];

  #EquipmentType = [];

  #EquipmentLocation = [
    {
      IdLocation: "",
      Location: "",
      Name: "",
      FK_Equipment: "",
    },
  ];
  #MetereologicalOrgan = [];

  async createMetereologicalEquipment(data = []) {
    this.#MetereologicalEquipment = data;
  }

  async createEquipmentLocation(data = []) {
    this.#EquipmentLocation = data;
  }

  async createMetereologicalOrgan(data = []) {
    this.#MetereologicalOrgan = data;
  }

  async createEquipmentType(data = []) {
    this.#EquipmentType = data;
  }

  async getFuncemeEquipmentByType(nameType) {
    const type = this.#EquipmentType.find((item) => item.Name == nameType);

    const organ = this.#MetereologicalOrgan.find(
      (item) => item.Name === "FUNCEME"
    );

    const equipment = this.#MetereologicalEquipment.filter(
      (eqp) => eqp.FK_Type == type.IdType && eqp.FK_Organ === organ.IdOrgan
    );

    return equipment;
  }

  async getInmetEquipmentByType(nameType) {
    const type = this.#EquipmentType.find((item) => item.Name == nameType);

    const organ = this.#MetereologicalOrgan.find(
      (item) => item.Name === "INMET"
    );

    const equipment = this.#MetereologicalEquipment.filter(
      (eqp) => eqp.FK_Type == type.IdType && eqp.FK_Organ === organ.IdOrgan
    );
    return equipment;
  }
}
