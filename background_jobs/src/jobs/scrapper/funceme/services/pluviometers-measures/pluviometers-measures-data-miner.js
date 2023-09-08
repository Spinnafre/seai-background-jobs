import { Logger } from "../../../../../lib/logger/logger.js";
import { ServiceProtocol } from "../../../core/service-protocol.js";

import { PluviometerMapper } from ".././../../core/mappers/pluviometer-mapper.js";

export class ExtractPluviometersFromFunceme extends ServiceProtocol {
  constructor(
    dataMiner,
    metereologicalEquipmentDao,
    pluviometerReadRepository
  ) {
    super();
    this.dataMiner = dataMiner;
    this.metereologicalEquipmentDao = metereologicalEquipmentDao;
    this.pluviometerReadRepository = pluviometerReadRepository;
  }

  async execute(params) {
    Logger.info({
      msg: `Iniciando busca de dados de pluviômetros pelo ftp da FUNCEME pela data ${params.getDate()}`,
    });

    const pluviometers = await this.metereologicalEquipmentDao.getEquipments({
      organName: "FUNCEME",
      eqpType: "pluviometer",
    });

    if (!pluviometers.length) {
      //Talvez não faça sentido ficar avisando que não tem PLUVIôMETROS cadastrados
      this.logs.addWarningLog("Não há pluviômetros da FUNCEME cadastrados");

      return;
    }

    this.logs.addInfoLog(
      "Iniciando busca de dados de medições de pluviômetros da FUNCEME"
    );

    const equipmentsCodes = pluviometers.map((eqp) => eqp.code);

    const measures = await this.dataMiner.fetch(
      equipmentsCodes,
      params.getDate()
    );

    const result = pluviometers.map((pluviometer) => {
      const measure =
        measures && measures.find((item) => item.code === pluviometer.code);

      if (!measure) {
        this.logs.addWarningLog(
          `Não foi possível obter dados de medição do pluviômetro ${pluviometer.code}, salvando dados sem medições.`
        );

        return PluviometerMapper.pluviometerToPersistency(
          pluviometer,
          null,
          params.getDate()
        );
      }

      this.logs.addInfoLog(
        `Sucesso ao obter dados de medição do pluviômetro ${pluviometer.code}`
      );

      return PluviometerMapper.pluviometerToPersistency(
        pluviometer,
        measure,
        params.getDate()
      );
    });

    Logger.info({
      msg: `Apagando dados de pluviômetros da FUNCEME pela data ${params.getDate()}`,
    });

    // yyyy-mm-dd
    await this.pluviometerReadRepository.deleteByTime(params.getDate());

    await this.pluviometerReadRepository.create(result);

    this.logs.addInfoLog(
      "Sucesso ao salvar leituras de pluviômetros da FUNCEME"
    );
  }
}
