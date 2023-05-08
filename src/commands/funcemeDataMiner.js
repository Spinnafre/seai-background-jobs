import { Command } from "./protocol/command.js";

export class FuncemeDataMinerCmd extends Command {
  #stationDataMiner;
  #pluviometerDataMiner;

  constructor(stationDataMiner, pluviometerDataMiner) {
    super();
    this.#stationDataMiner = stationDataMiner;
    this.#pluviometerDataMiner = pluviometerDataMiner;
  }

  async execute() {
    const params = this.getParams();

    await this.#stationDataMiner(params);
    await this.#pluviometerDataMiner(params);
  }
}
