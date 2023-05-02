export class Et0InMemory {
  #Et0 = [
    {
      Value: 2,
      FK_Station_Read: "",
    },
  ];

  async create(data = []) {
    this.#Et0 = [...this.#Et0, ...data];
  }
  async update(data = []) {}
  async list() {
    return this.#Et0;
  }
}
