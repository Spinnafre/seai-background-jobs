export class PluviometerRead {
  #PluviometerRead = [
    {
      IdRead: "",
      Value: "",
      FK_Time: "",
      FK_Organ: "",
      FK_Equipment: "",
    },
  ];

  #ReadTime = [];

  async create(reads = []) {
    this.#PluviometerRead = [...this.#PluviometerRead, ...reads];
  }

  async list() {
    return this.#PluviometerRead;
  }

  async update(reads = []) {}
}
