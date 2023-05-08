export class ExtractStationsFromFunceme {
  constructor(dataMiner, metereologicalEquipmentDao, stationReadDao) {
    this.dataMiner = dataMiner;
    this.metereologicalEquipmentDao = metereologicalEquipmentDao;
    this.stationReadDao = stationReadDao;
  }

  async execute(params) {
    try {
      const stations =
        await this.metereologicalEquipmentDao.getFuncemeStations();

      if (!stations.length) {
        params.commandLogs.addWarningLog(
          "Não há estações da FUNCEME cadastradas"
        );
        return;
      }

      const codes = stations.map((station) => station.code);

      const measures = await this.dataMiner.getStationsByCodesAndDate(
        codes,
        params.getDate()
      );

      await this.stationReadDao.create(stations, measures, params.idTimestamp);

      params.commandLogs.addInfoLog(
        "Sucesso ao salvar leituras de estações da FUNCEME"
      );
    } catch (error) {
      console.error(error);
      params.commandLogs.addInfoLog(error.message);
    }
  }
}
