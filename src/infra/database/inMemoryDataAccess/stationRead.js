export class StationRead {
  #ReadStations = [];

  #ReadTime = [];

  async create(reads = []) {
    const toPersistency = reads.map((data) => {
      const { idEquipment, organ, measures, idOrgan } = data;

      const TotalRadiation = Reflect.has(measures, "radiation")
        ? measures.radiation
        : null;
      const RelativeHumidity = Reflect.has(measures, "humidity")
        ? measures.humidity
        : null;
      const AtmosphericTemperature = Reflect.has(measures, "temperature")
        ? measures.temperature
        : null;
      const WindVelocity = Reflect.has(measures, "radiation")
        ? measures.radiation
        : null;

      return {
        IdRead: null,
        TotalRadiation,
        RelativeHumidity,
        AtmosphericTemperature,
        WindVelocity,
        FK_Time: "",
        FK_Organ: idOrgan,
        FK_Equipment: idEquipment,
      };
    });

    this.#ReadStations = [...toPersistency];
  }

  async list() {
    return this.#ReadStations;
  }

  async update(reads = []) {}

  async getByTime(time) {}
}
