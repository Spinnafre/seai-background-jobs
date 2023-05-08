import { Command } from "./protocol/command.js";

export class InmetDataMinerCmd extends Command {
  #stationDataMiner;
  #pluviometerDataMiner;

  constructor(stationDataMiner, pluviometerDataMiner = {}) {
    super();
    this.#stationDataMiner = stationDataMiner;
    this.#pluviometerDataMiner = {};
  }

  async execute() {
    const params = this.getParams();

    await this.#stationDataMiner(params);
    // await this.#pluviometerDataMiner(params);
  }
}
