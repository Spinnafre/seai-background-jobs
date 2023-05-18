import { Mapper } from "../../../../core/mappers/mapper.js";

export class PluviometerRead {
  #PluviometerRead = [];

  async create(pluviometers, measures) {
    const data = Mapper.pluviometerToPersistency(pluviometers, measures).map(
      (read) => ({
        IdRead: Math.round(Math.random() * 1000),
        ...read,
      })
    );

    this.#ReadStations = [...data];
  }

  async list() {
    return this.#PluviometerRead;
  }
}
