import { Command } from "../../../scrapper/core/commands/command.js";

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

    if (!pluviometers.length) {
      this.logs.addWarningLog("Não há pluviômetros da FUNCEME cadastrados");

      return;
    }

    const codes = pluviometers.map((station) => station.code);

    const measures = await this.dataMiner.getPluviometersByCodesAndDate(
      codes,
      params.getDate()
    );

    await this.pluviometerReadDao.create(
      pluviometers,
      measures,
      params.idTimestamp
    );

    this.logs.addInfoLog(
      "Sucesso ao salvar leituras de pluviômetros da FUNCEME"
    );
  }
}
