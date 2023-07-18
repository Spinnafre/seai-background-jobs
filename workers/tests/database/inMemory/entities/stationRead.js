export class StationRead {
  #ReadStations = [];

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
}
