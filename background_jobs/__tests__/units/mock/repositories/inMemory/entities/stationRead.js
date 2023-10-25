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

  async getStationReads({ idEqp, date, hour }) {
    const data = this.#ReadStations.filter((read) => {
      if (hour) {
        return (
          read.FK_Equipment === idEqp &&
          read.Time === date &&
          read.Hour === hour
        );
      } else {
        return read.FK_Equipment === idEqp && read.Time === date;
      }
    });

    if (!data) {
      return null;
    }

    return data.map((stationRead) => {
      return {
        idRead: stationRead.IdRead,
        time: stationRead.Time,
        hour: stationRead.Hour,
        totalRadiation: stationRead.TotalRadiation,
        averageRelativeHumidity: stationRead.AverageRelativeHumidity,
        maxRelativeHumidity: stationRead.MaxRelativeHumidity,
        minRelativeHumidity: stationRead.MinRelativeHumidity,
        averageAtmosphericTemperature:
          stationRead.AverageAtmosphericTemperature,
        minAtmosphericTemperature: stationRead.MinAtmosphericTemperature,
        maxAtmosphericTemperature: stationRead.MaxAtmosphericTemperature,
        atmosphericPressure: stationRead.AtmosphericPressure,
        windVelocity: stationRead.WindVelocity,
      };
    });
  }
}
