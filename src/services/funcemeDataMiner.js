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

      const stations =
        await this.metereologicalEquipmentDao.getFuncemeEquipmentByType(
          "station"
        );

      const pluviometers =
        await this.metereologicalEquipmentDao.getFuncemeEquipmentByType(
          "pluviometer"
        );

      const STATIONS_CODES = stations.map(
        (station) => station.IdEquipmentExternal
      );

      const PLUVIOMETERS_CODES = pluviometers.map(
        (station) => station.IdEquipmentExternal
      );

      // Ver uma forma de criar um único método no gateway para trazer todos os dados
      // de uma só vez sem precisar ficar tendo que se conectar e desconectar no serviço.
      await this.ftpGateway.connect();

      const stationList = await this.ftpGateway.getStationsByCodesAndDate(
        STATIONS_CODES,
        date
      );
      const pluviometerList =
        await this.ftpGateway.getPluviometersByCodesAndDate(
          PLUVIOMETERS_CODES,
          date
        );

      await this.ftpGateway.close();

      console.log("STATIONS = ", stationList);
      console.log("RAIN = ", pluviometerList);

      await this.stationReadDao.create(stationList);

      await this.pluviometerReadDao.create(pluviometerList);
    } catch (error) {
      // append to errors logs
      console.log(error);
    }
  }
}

export { FuncemeDataMiner };
