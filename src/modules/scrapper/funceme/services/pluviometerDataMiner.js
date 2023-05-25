import { Command } from "../../../scrapper/core/commands/command.js";

import { Mapper } from "../../core/mappers/mapper.js";

export class ExtractPluviometersFromFunceme extends Command {
  constructor(dataMiner, metereologicalEquipmentDao, pluviometerReadDao) {
    super();
    this.dataMiner = dataMiner;
    this.metereologicalEquipmentDao = metereologicalEquipmentDao;
    this.pluviometerReadDao = pluviometerReadDao;
  }

  async execute(params) {
    const pluviometers =
      await this.metereologicalEquipmentDao.getFuncemePluviometers();

    if (!pluviometers.equipments.length) {
      this.logs.addWarningLog("Não há pluviômetros da FUNCEME cadastrados");

      return;
    }

    const measures = await this.dataMiner.getPluviometersByCodesAndDate(
      pluviometers.codes,
      params.getDate()
    );

    await this.pluviometerReadDao.create(
      Mapper.stationsToPersistency(pluviometers.equipments, measures)
    );

    this.logs.addInfoLog(
      "Sucesso ao salvar leituras de pluviômetros da FUNCEME"
    );
  }
}
