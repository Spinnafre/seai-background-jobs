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
    const RAIN_GAUGES_CODES = ["23984"];

    await this.funcemeGateway.connect();

    const stations = await this.funcemeGateway.getStationDataByCodes(
      STATIONS_CODES
    );

    console.log("STATIONS = ", stations);

    const rainGauges = await this.funcemeGateway.getRainGaugeDataByCodes(
      RAIN_GAUGES_CODES
    );

    console.log("RAIN = ", rainGauges);

    await this.funcemeGateway.close();
  }
}

export { FuncemeDataMiner };
