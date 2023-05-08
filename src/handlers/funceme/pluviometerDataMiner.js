export class ExtractPluviometersFromFunceme {
  constructor(dataMiner, metereologicalEquipmentDao, pluviometerReadDao) {
    this.dataMiner = dataMiner;
    this.metereologicalEquipmentDao = metereologicalEquipmentDao;
    this.pluviometerReadDao = pluviometerReadDao;
  }
  async execute(params) {
    try {
      const pluviometers =
        await this.metereologicalEquipmentDao.getFuncemePluviometers();

      if (!pluviometers.length) {
        params.commandLogs.addWarningLog(
          "Não há pluviômetros da FUNCEME cadastrados"
        );

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

      params.commandLogs.addInfoLog(
        "Sucesso ao salvar leituras de pluviômetros da FUNCEME"
      );
    } catch (error) {
      console.error(error);
      params.commandLogs.addInfoLog(error.message);
    }
  }
}
