import { ServiceProtocol } from "../../../core/service-protocol.js";

import { PluviometerMapper } from ".././../../core/mappers/pluviometer-mapper.js";

export class ExtractPluviometersFromFunceme extends ServiceProtocol {
  constructor(dataMiner, metereologicalEquipmentDao, pluviometerReadDao) {
    super();
    this.dataMiner = dataMiner;
    this.metereologicalEquipmentDao = metereologicalEquipmentDao;
    this.pluviometerReadDao = pluviometerReadDao;
  }

  async execute(params) {
    console.log(
      `[Funceme] Iniciando busca de dados de pluviômetros pelo ftp da FUNCEME pela data ${params.getDate()}`
    );
    const pluviometers =
      await this.metereologicalEquipmentDao.getFuncemePluviometers();

    if (!pluviometers.equipments.length) {
      //Talvez não faça sentido ficar avisando que não tem PLUVIôMETROS cadastrados
      this.logs.addWarningLog("Não há pluviômetros da FUNCEME cadastrados");

      return;
    }

    this.logs.addInfoLog(
      "Iniciando busca de dados de medições de pluviômetros da FUNCEME"
    );

    const measures = await this.dataMiner.fetch(
      pluviometers.codes,
      params.getDate()
    );

    const result = pluviometers.equipments.map((pluviometer) => {
      const measure =
        measures && measures.find((item) => item.code === pluviometer.code);

      if (!measure) {
        console.log(
          `[Funceme] Não foi possível obter dados de medição do pluviômetro ${pluviometer.name}, salvando dados sem medições`
        );

        this.logs.addWarningLog(
          `Não foi possível obter dados de medição do pluviômetro ${pluviometer.name}, salvando dados sem medições.`
        );

        return PluviometerMapper.pluviometerToPersistency(pluviometer, null);
      }

      console.log(
        `[Funceme] Sucesso ao obter dados de medição estação ${pluviometer.name}`
      );

      return PluviometerMapper.pluviometerToPersistency(pluviometer, measure);
    });

    await this.pluviometerReadDao.create(result);

    this.logs.addInfoLog(
      "Sucesso ao salvar leituras de pluviômetros da FUNCEME"
    );
  }
}
