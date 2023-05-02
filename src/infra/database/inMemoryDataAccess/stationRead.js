export class StationRead {
  #ReadStations = [
    {
      IdRead: "",
      TotalRadiation: "",
      RelativeHumidity: "",
      AtmosphericTemperature: "",
      WindVelocity: "",
      FK_Time: "",
      FK_Organ: "",
      FK_Equipment: "",
    },
  ];

  #ReadTime = [];

  async create(reads = []) {
    this.#ReadStations = [...this.#ReadStations, ...reads];
  }

  async list() {
    return this.#ReadStations;
  }

  async update(reads = []) {}
}
