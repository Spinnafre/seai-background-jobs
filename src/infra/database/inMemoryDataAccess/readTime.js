export class Et0InMemory {
  #Times = [
    {
      IdTime: null,
      Time: "",
    },
  ];

  async create(data = []) {
    this.#Times = [...this.#Times, ...data];
  }
  async update(data = []) {}

  async list() {
    return this.#Times;
  }
}
