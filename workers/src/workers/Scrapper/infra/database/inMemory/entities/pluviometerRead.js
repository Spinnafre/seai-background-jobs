import { Mapper } from "../../../../core/mappers/mapper.js";

export class PluviometerRead {
  #PluviometerRead = [];

  async create(measures) {
    const data = measures.map((read) => ({
      IdRead: Math.round(Math.random() * 1000),
      ...read,
    }));

    this.#PluviometerRead = [...data];
  }

  async list() {
    return this.#PluviometerRead;
  }
}
