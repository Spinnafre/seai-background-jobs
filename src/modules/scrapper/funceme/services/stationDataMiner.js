import { Command } from "../../../scrapper/core/commands/command.js";

export class ExtractStationsFromFunceme extends Command {
  constructor(dataMiner, metereologicalEquipmentDao, stationReadDao, logs) {
    this.dataMiner = dataMiner;
    this.metereologicalEquipmentDao = metereologicalEquipmentDao;
    this.stationReadDao = stationReadDao;
  }

  async execute(params) {
    const stations = await this.metereologicalEquipmentDao.getFuncemeStations();

    if (!stations.length) {
      this.logs.addWarningLog("Não há estações da FUNCEME cadastradas");
      return;
    }

    const codes = stations.map((station) => station.code);

    const measures = await this.dataMiner.getStationsByCodesAndDate(
      codes,
      params.getDate()
    );

    await this.stationReadDao.create(stations, measures, params.idTimestamp);

    this.logs.addInfoLog("Sucesso ao salvar leituras de estações da FUNCEME");
  }
}
