export class MetereologicalEquipmentRepositoryInMemory {
  #metereologicalEquipment;
  #stationsReads = [];
  #pluviometersReads = [];

  constructor(eqps = [], stationsReads = [], pluviometersReads = []) {
    this.#metereologicalEquipment = eqps.length ? eqps : [];
    this.#stationsReads = stationsReads;
    this.#pluviometersReads = pluviometersReads;
  }

  get stationsReads() {
    return this.#stationsReads;
  }

  get pluviometersReads() {
    return this.#pluviometersReads;
  }

  get equipments() {
    return this.#metereologicalEquipment;
  }

  async create(data = []) {
    const insertedEquipments = new Map();
    for (const item of data) {
      const id = new Date().getTime();
      item.IdEquipment = id;

      this.#metereologicalEquipment.push(item);
      insertedEquipments.set(item.IdEquipmentExternal, id);
    }

    return insertedEquipments;
  }

  async getTypes() {
    return new Map([
      ["station", 1],
      ["pluviometer", 2],
    ]);
  }

  async getOrganByName(organName) {
    return {
      Id_Organ: 1,
      Host: "FUNCEME",
      User: "TEST",
      Password: "123",
    };
  }

  async getEquipments({ organName = null, eqpType = "" }) {
    const types = await this.getTypes();

    const idType = types.get(eqpType);

    let equipments = [];

    if (organName) {
      equipments = this.#metereologicalEquipment.filter(
        (eqp) => eqp.Type == idType && eqp.Organ === organName
      );
    } else {
      equipments = this.#metereologicalEquipment.filter(
        (eqp) => eqp.Type == idType
      );
    }

    return equipments.map((station) => {
      return {
        Id: station.IdEquipment,
        Code: station.IdEquipmentExternal,
        Location: station.Name,
        Altitude: station.Altitude,
        Type: station.Type,
        Organ: station.Organ,
        Id_Organ: station.Organ_Id,
      };
    });
  }

  async insertStationsMeasurements(measurements = []) {
    this.#stationsReads = [...measurements, ...this.#stationsReads];
  }

  async insertPluviometersMeasurements(measurements = []) {
    this.#pluviometersReads = [...measurements, ...this.#pluviometersReads];
  }
}
