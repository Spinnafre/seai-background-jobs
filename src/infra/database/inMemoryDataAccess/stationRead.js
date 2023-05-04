export class StationRead {
  #ReadStations = [];

  #ReadTime = [];

  async create(reads = []) {
    const toPersistency = reads.map((data) => {
      const { IdEquipment, measures, IdOrgan, IdTime } = data;

      const TotalRadiation = Reflect.has(measures, "radiation")
        ? measures.radiation
        : null;

      const RelativeHumidity = Reflect.has(measures, "humidity")
        ? measures.humidity
        : null;

      const AtmosphericTemperature = Reflect.has(measures, "temperature")
        ? measures.temperature
        : null;

      const WindVelocity = Reflect.has(measures, "windSpeed")
        ? measures.windSpeed
        : null;

      return {
        IdRead: Math.round(Math.random() * 1000),
        TotalRadiation,
        RelativeHumidity,
        AtmosphericTemperature,
        WindVelocity,
        FK_Time: IdTime,
        FK_Organ: IdOrgan,
        FK_Equipment: IdEquipment,
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
