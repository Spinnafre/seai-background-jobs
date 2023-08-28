export class StationReadRepositoryInMemory {
  #ReadStations = [];

  constructor(reads = []) {
    this.#ReadStations = reads;
  }

  async create(measures = []) {
    const data = measures.map((read) => ({
      IdRead: Math.round(Math.random() * 1000),
      ...read,
    }));

    this.#ReadStations = [...data];
  }

  async list() {
    return this.#ReadStations;
  }

  async getStationReadsByEquipment(idEqp) {
    console.log(idEqp, " ", this.#ReadStations);
    const data = this.#ReadStations.filter((read) => {
      return read.FK_Equipment === idEqp;
    });

    if (!data) {
      return null;
    }

    return data.map((stationRead) => {
      return {
        idRead: stationRead.IdRead,
        totalRadiation: stationRead.TotalRadiation,
        relativeHumidity: stationRead.RelativeHumidity,
        atmosphericTemperature: stationRead.AtmosphericTemperature,
        windVelocity: stationRead.WindVelocity,
      };
    });
  }
}
