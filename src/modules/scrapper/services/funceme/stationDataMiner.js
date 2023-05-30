import { Command } from "../../core/commands/command.js";

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
      this.logs.addWarningLog(
        "Não há equipamentos de estações da FUNCEME cadastradas"
      );
      return;
    }

    console.log("DATA - > ", params.getDate());

    this.logs.addInfoLog(
      "Iniciando busca de dados de medições das estações da FUNCEME"
    );

    const measures = await this.dataMiner.getStationsByCodesAndDate(
      stations.codes,
      params.getDate()
    );

    console.log("measures", measures);

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

        return Mapper.stationToPersistency(station, null);
      }

      console.log(`Sucesso ao obter dados de medição estação ${station.name}`);

      return Mapper.stationToPersistency(station, measure);
    });

    await this.stationReadDao.create(result);

    this.logs.addInfoLog("Sucesso ao salvar leituras de estações da FUNCEME");
  }
}
