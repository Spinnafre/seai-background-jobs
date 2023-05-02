import { formatDateToYYMMDD, getYesterday } from "../utils/index.js";

class FuncemeDataMiner {
  constructor(
    funcemeGateway,
    metereologicalEquipmentDao,
    stationReadDao,
    pluviometerReadDao
  ) {
    this.ftpGateway = funcemeGateway;
    this.metereologicalEquipmentDao = metereologicalEquipmentDao;
    this.stationReadDao = stationReadDao;
    this.pluviometerReadDao = pluviometerReadDao;
  }
  async execute() {
    try {
      const date = formatDateToYYMMDD(getYesterday());
      console.log("DATA = ", date);
      // TODO: Buscar códigos das estações da FUNCEME
      // const STATIONS_CODES = ["A305", "B8505818"];
      // const RAIN_GAUGES_CODES = ["23984"];
      const STATIONS =
        await this.metereologicalEquipmentDao.getFuncemeEquipmentByType(
          "station"
        );

      const PLUVIOMETERS =
        await this.metereologicalEquipmentDao.getFuncemeEquipmentByType(
          "pluviometer"
        );

      const STATIONS_CODES = STATIONS.map(
        (station) => station.IdEquipmentExternal
      );

      const PLUVIOMETERS_CODES = PLUVIOMETERS.map(
        (station) => station.IdEquipmentExternal
      );

      // Ver uma forma de criar um único método no gateway para trazer todos os dados
      // de uma só vez sem precisar ficar tendo que se conectar e desconectar no serviço.
      await this.ftpGateway.connect();

      const stations = await this.ftpGateway.getStationsByCodesAndDate(
        STATIONS_CODES,
        date
      );
      const pluviometers = await this.ftpGateway.getPluviometersByCodesAndDate(
        PLUVIOMETERS_CODES,
        date
      );

      await this.ftpGateway.close();

      console.log("STATIONS = ", stations[0].measures);
      console.log("RAIN = ", pluviometers);

      await this.stationReadDao.create(stations);

      await this.pluviometerReadDao.create(pluviometers);
    } catch (error) {
      // append to errors logs
      console.log(error);
    }
  }
}

export { FuncemeDataMiner };
