import { formatDateToYYMMDD, getYesterday } from "../utils/date.js";

class FuncemeDataMiner {
  constructor(funcemeGateway) {
    this.funcemeGateway = funcemeGateway;
    this.repository = "";
  }
  async execute() {
    const date = formatDateToYYMMDD(getYesterday());

    // TODO: Buscar códigos das estações da FUNCEME
    const STATIONS_CODES = ["A305", "B8505818"];

    const stations = await this.funcemeGateway.getStationsByCodes(
      STATIONS_CODES
    );
  }
}

export { FuncemeDataMiner };
