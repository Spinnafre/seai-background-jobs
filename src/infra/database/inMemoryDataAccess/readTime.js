export class ReadTimeInMemory {
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

  async getTimeByValue(value) {
    return this.#Times.find((time) => time.Time === value);
  }
}
