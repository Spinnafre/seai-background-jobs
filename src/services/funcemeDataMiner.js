class FuncemeDataMiner {
  constructor(funcemeGateway) {
    this.funcemeGateway = funcemeGateway;
    this.repository = "";
  }
  async execute() {
    try {
      // TODO: Buscar códigos das estações da FUNCEME
      const STATIONS_CODES = ["A305", "B8505818"];
      const RAIN_GAUGES_CODES = ["23984"];

      await this.funcemeGateway.connect();

      const stations = await this.funcemeGateway.getYesterdayStationsByCodes(
        STATIONS_CODES
      );

      console.log(
        "STATIONS = ",
        stations.map((item) => item.measures)
      );

      const rainGauges =
        await this.funcemeGateway.getYesterdayRainGaugesByCodes(
          RAIN_GAUGES_CODES
        );

      console.log("RAIN = ", rainGauges[0].measures);

      await this.funcemeGateway.close();
    } catch (error) {
      // append to errors logs
      console.log(error);
    }
  }
}

export { FuncemeDataMiner };
