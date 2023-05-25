import { Command } from "../../../scrapper/core/commands/command.js";

import { Mapper } from "../../core/mappers/mapper.js";

export class ExtractStationsFromFunceme extends Command {
  constructor(dataMiner, metereologicalEquipmentDao, stationReadDao) {
    super();
    this.dataMiner = dataMiner;
    this.metereologicalEquipmentDao = metereologicalEquipmentDao;
    this.stationReadDao = stationReadDao;
  }

  async execute(params) {
    const stations = await this.metereologicalEquipmentDao.getFuncemeStations();

    if (!stations.equipments.length) {
      this.logs.addWarningLog("Não há estações da FUNCEME cadastradas");
      return;
    }

    const measures = await this.dataMiner.getStationsByCodesAndDate(
      stations.codes,
      params.getDate()
    );

    console.log("measures", measures);

    await this.stationReadDao.create(
      Mapper.stationsToPersistency(stations.equipments, measures)
    );

    this.logs.addInfoLog("Sucesso ao salvar leituras de estações da FUNCEME");
  }
}
