import { formatDateToYYMMDD, getYesterday } from "../utils/index.js";

class FuncemeDataMiner {
  constructor(
    funcemeGateway,
    metereologicalEquipmentDao,
    stationReadDao,
    pluviometerReadDao,
    readTimeDao
  ) {
    this.ftpGateway = funcemeGateway;
    this.metereologicalEquipmentDao = metereologicalEquipmentDao;
    this.stationReadDao = stationReadDao;
    this.pluviometerReadDao = pluviometerReadDao;
    this.readTimeDao = readTimeDao;
  }
  async execute() {
    try {
      const date = formatDateToYYMMDD(getYesterday());

      // Avaliar o que deve ser feito caso não tenha dados de estação e pluviômetros
      const stations =
        await this.metereologicalEquipmentDao.getFuncemeEquipmentByType(
          "station"
        );

      const pluviometers =
        await this.metereologicalEquipmentDao.getFuncemeEquipmentByType(
          "pluviometer"
        );

      // E se não tiver dados dos equipamentos?

      const STATIONS_CODES = stations.map(
        (station) => station.IdEquipmentExternal
      );

      const PLUVIOMETERS_CODES = pluviometers.map(
        (station) => station.IdEquipmentExternal
      );

      // Ver uma forma de criar um único método no gateway para trazer todos os dados
      // de uma só vez sem precisar ficar tendo que se conectar e desconectar no serviço.
      await this.ftpGateway.connect();

      const stationWithMeasures =
        await this.ftpGateway.getStationsByCodesAndDate(STATIONS_CODES, date);

      const pluviometerWithMeasures =
        await this.ftpGateway.getPluviometersByCodesAndDate(
          PLUVIOMETERS_CODES,
          date
        );

      await this.ftpGateway.close();

      if (stationWithMeasures) {
        stationWithMeasures.map((stationWithMeasure) => {
          const station = stations.find(
            (item) => item.IdEquipmentExternal === stationWithMeasure.code
          );

          if (!!station) {
            stationWithMeasure.setIdType(station.Type.FK_Type);
            stationWithMeasure.setIdOrgan(station.Organ.FK_Organ);
            stationWithMeasure.setIdEquipment(station.IdEquipment);
          }
        });
      }

      await this.stationReadDao.create(stationWithMeasures);

      await this.pluviometerReadDao.create(pluviometerWithMeasures);
    } catch (error) {
      // append to errors logs
      console.log(error);
    }
  }
}

export { FuncemeDataMiner };
