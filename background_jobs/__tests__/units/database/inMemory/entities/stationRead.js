export class StationReadRepositoryInMemory {
  #ReadStations = [];

  constructor(reads = []) {
    this.#ReadStations = reads;
  }
  async getStationsReadsByDate(idEqp, idOrgan, date) {
    const data = this.#ReadStations.filter((read) => {
      return (
        read.FK_Equipment === idEqp &&
        read.Time === date &&
        read.FK_Organ === idOrgan
      );
    });

    if (!data) {
      return null;
    }

    return data.map((read) => {
      return {
        idRead: read.IdRead,
        time: read.Time,
      };
    });
  }
  async create(measures = []) {
    const data = measures.map((read) => ({
      IdRead: Math.round(Math.random() * 1000),
      ...read,
    }));

    this.#ReadStations = [...data];

    return data.map((read) => ({
      idRead: read.IdRead,
      date: read.Time,
    }));
  }

  async deleteByTime(time) {
    this.#ReadStations = this.#ReadStations.filter(
      (read) => read.Time !== time
    );
  }

  async list() {
    return this.#ReadStations;
  }

  async getStationReadsByEquipment(idEqp) {
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
