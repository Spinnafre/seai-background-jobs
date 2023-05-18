import { Mapper } from "../../../../core/mappers/mapper.js";

export class StationRead {
  #ReadStations = [];

  async create(stations, measures) {
    const data = Mapper.stationsToPersistency(stations, measures).map(
      (read) => ({
        IdRead: Math.round(Math.random() * 1000),
        ...read,
      })
    );

    this.#ReadStations = [...data];
  }

  async list() {
    return this.#ReadStations;
  }
}
