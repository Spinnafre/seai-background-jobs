import { Mapper } from "../../../core/mapper/map.js";

export class StationRead {
  #ReadStations = [];

  async create(stations, measures, idTime) {
    const data = Mapper.stationsToPersistency(stations, measures, idTime).map(
      (read) => ({
        IdRead: Math.round(Math.random() * 1000),
        ...read,
      })
    );

    this.#ReadStations = [...data];
  }

  async list() {
    return Mapper.stationsToDomain(this.#ReadStations);
  }
}
