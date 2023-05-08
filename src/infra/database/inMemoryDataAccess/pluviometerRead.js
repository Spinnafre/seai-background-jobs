import { Mapper } from "../../../core/mapper/map.js";

export class PluviometerRead {
  #PluviometerRead = [];

  async create(pluviometers, measures, idTime) {
    const data = Mapper.pluviometerToPersistency(
      pluviometers,
      measures,
      idTime
    ).map((read) => ({
      IdRead: Math.round(Math.random() * 1000),
      ...read,
    }));

    this.#ReadStations = [...data];
  }

  async list() {
    return Mapper.pluviometersToDomain(this.#PluviometerRead);
  }
}
