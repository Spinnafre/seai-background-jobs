import { Logger } from "../../../../../lib/logger/logger.js";
import { ServiceProtocol } from "../../../core/service-protocol.js";

import { StationMapper } from ".././../../core/mappers/station-mapper.js";

export class ExtractStationsFromFunceme extends ServiceProtocol {
  constructor(dataMiner, metereologicalEquipmentDao, stationReadDao) {
    super();
    this.dataMiner = dataMiner;
    this.metereologicalEquipmentDao = metereologicalEquipmentDao;
    this.stationReadDao = stationReadDao;
  }

  async execute(params) {
    Logger.info({
      msg: `Iniciando busca de dados de medições das estações pelo ftp da FUNCEME pela data ${params.getDate()}`,
    });

    const stations = await this.metereologicalEquipmentDao.getEquipments({
      organName: "FUNCEME",
      eqpType: "station",
    });

    if (!stations.length) {
      this.logs.addWarningLog(
        "Não há equipamentos de estações da FUNCEME cadastradas"
      );
      return;
    }

    this.logs.addInfoLog(
      "Iniciando busca de dados de medições das estações da FUNCEME"
    );

    const equipmentsCodes = stations.map((eqp) => eqp.code);

    const measures = await this.dataMiner.fetch(
      equipmentsCodes,
      params.getDate()
    );

    const result = stations.map((station) => {
      const measure =
        measures && measures.find((item) => item.code === station.code);

      if (!measure) {
        this.logs.addWarningLog(
          `Não foi possível obter dados de medição estação ${station.code}, salvando dados sem medições.`
        );

        return StationMapper.stationToPersistency(
          station,
          null,
          params.getDate()
        );
      }

      this.logs.addInfoLog(
        `Sucesso ao obter dados de medição estação ${station.code}`
      );

      return StationMapper.stationToPersistency(
        station,
        measure,
        params.getDate()
      );
    });

    Logger.info({
      msg: `Apagando dados de medições das estações da FUNCEME pela data ${params.getDate()}`,
    });

    // yyyy-mm-dd
    await this.stationReadDao.deleteByTime(params.getDate());

    await this.stationReadDao.create(result);

    this.logs.addInfoLog("Sucesso ao salvar leituras de estações da FUNCEME");
  }
}
