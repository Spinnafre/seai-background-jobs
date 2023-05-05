import { FuncemeMap } from "../core/mappers/funceme/funcemeMap.js";
import { formatDateToHyphenFormat } from "../utils/index.js";

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
  async execute(date = { IdTime: null, Time: "" }) {
    try {
      /*
        Verifica se a data existe, se existir então não salva
        se não existir então salva
      */
      const formatedDate = formatDateToHyphenFormat(date.Time);

      const stationsEquipments =
        await this.metereologicalEquipmentDao.getFuncemeEquipmentByType(
          "station"
        );
      const pluviometersEquipments =
        await this.metereologicalEquipmentDao.getFuncemeEquipmentByType(
          "pluviometer"
        );

      if (!stationsEquipments.length) {
        console.log("Não há estações da FUNCEME cadastradas");
      }

      if (!pluviometersEquipments.length) {
        console.log("Não há pluviômetros da FUNCEME cadastrados");
      }

      // Avaliar o que deve ser feito caso não tenha dados de estação e pluviômetros

      // E se não tiver dados dos equipamentos?
      const STATIONS_CODES = stationsEquipments.map(
        (station) => station.IdEquipmentExternal
      );

      const PLUVIOMETERS_CODES = pluviometersEquipments.map(
        (station) => station.IdEquipmentExternal
      );

      // Ver uma forma de criar um único método no gateway para trazer todos os dados
      // de uma só vez sem precisar ficar tendo que se conectar e desconectar no serviço.
      await this.ftpGateway.connect();

      let stationWithMeasures = await this.ftpGateway.getStationsByCodesAndDate(
        STATIONS_CODES,
        formatedDate
      );

      let pluviometerWithMeasures =
        await this.ftpGateway.getPluviometersByCodesAndDate(
          PLUVIOMETERS_CODES,
          formatedDate
        );

      await this.ftpGateway.close();

      if (stationWithMeasures.length) {
        stationWithMeasures.map((stationWithMeasure) => {
          const station = stationsEquipments.find(
            (item) => item.IdEquipmentExternal === stationWithMeasure.code
          );

          if (!!station == true) {
            stationWithMeasure.setIdType(station.Type.FK_Type);
            stationWithMeasure.setIdOrgan(station.Organ.FK_Organ);
            stationWithMeasure.setIdEquipment(station.IdEquipment);
            stationWithMeasure.setAltitude(station.Altitude);
            stationWithMeasure.setIdTime(date.IdTime);
          }

          return stationWithMeasure;
        });
      } else {
        stationWithMeasures = stationsEquipments.map((equipment) => {
          const station = FuncemeMap.stationToDomain({
            code: equipment.IdEquipmentExternal,
            name: equipment.Name,
            organ: equipment.Organ.Name,
            altitude: equipment.Altitude,
            measures: {},
          });

          station.setIdType(equipment.Type.FK_Type);
          station.setIdOrgan(equipment.Organ.FK_Organ);
          station.setIdEquipment(equipment.IdEquipment);
          station.setAltitude(equipment.Altitude);
          station.setIdTime(date.IdTime);

          return station;
        });
      }

      if (pluviometerWithMeasures.length) {
        pluviometerWithMeasures.map((pluviometerWithMeasure) => {
          const pluviometer = pluviometersEquipments.find(
            (item) => item.IdEquipmentExternal === pluviometerWithMeasure.code
          );

          if (!!pluviometer == true) {
            pluviometerWithMeasure.setIdType(pluviometer.Type.FK_Type);
            pluviometerWithMeasure.setIdOrgan(pluviometer.Organ.FK_Organ);
            pluviometerWithMeasure.setIdEquipment(pluviometer.IdEquipment);
            pluviometerWithMeasure.setIdTime(date.IdTime);
          }

          return pluviometerWithMeasure;
        });
      } else {
        pluviometerWithMeasures = pluviometersEquipments.map((equipment) => {
          const pluviometer = FuncemeMap.pluviometerToDomain({
            code: equipment.IdEquipmentExternal,
            name: equipment.Name,
            organ: equipment.Organ.Name,
            measures: {},
          });

          pluviometer.setIdTime(date.IdTime);
          pluviometer.setIdType(equipment.Type.FK_Type);
          pluviometer.setIdOrgan(equipment.Organ.FK_Organ);
          pluviometer.setIdEquipment(equipment.IdEquipment);
          pluviometer.setIdTime(date.IdTime);

          return pluviometer;
        });
      }

      stationWithMeasures &&
        (await this.stationReadDao.create(stationWithMeasures));

      pluviometerWithMeasures &&
        (await this.pluviometerReadDao.create(pluviometerWithMeasures));
    } catch (error) {
      // append to errors logs
      console.log(error);
    }
  }
}

export { FuncemeDataMiner };
