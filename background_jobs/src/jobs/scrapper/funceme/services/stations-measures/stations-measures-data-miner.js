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
    const stations = await this.metereologicalEquipmentDao.getFuncemeStations();

    if (!stations.equipments.length) {
      this.logs.addWarningLog(
        "Não há equipamentos de estações da FUNCEME cadastradas"
      );
      return;
    }

    this.logs.addInfoLog(
      "Iniciando busca de dados de medições das estações da FUNCEME"
    );

    const measures = await this.dataMiner.fetch(
      stations.codes,
      params.getDate()
    );

    const result = stations.equipments.map((station) => {
      const measure =
        measures && measures.find((item) => item.code === station.code);

      if (!measure) {
        console.log(
          `Não foi possível obter dados de medição estação ${station.name}, salvando dados sem medições`
        );

        this.logs.addWarningLog(
          `Não foi possível obter dados de medição estação ${station.name}, salvando dados sem medições.`
        );

        return StationMapper.stationToPersistency(station, null);
      }

      console.log(`Sucesso ao obter dados de medição estação ${station.name}`);

      return StationMapper.stationToPersistency(station, measure);
    });

    await this.stationReadDao.create(result);

    this.logs.addInfoLog("Sucesso ao salvar leituras de estações da FUNCEME");
  }
}
