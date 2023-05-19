import { setTimeout } from "node:timers/promises";

import scrapperConfig from "../../config/scrapper.js";

import { Command } from "../../core/commands/command.js";
import { Mapper } from "../../core/mappers/mapper.js";

export class StationDataMiner extends Command {
  constructor(
    dataMiner,
    metereologicalEquipmentDao,
    stationReadDao,
    pluviometerReadDao
  ) {
    super();
    this.dataMiner = dataMiner;
    this.metereologicalEquipmentDao = metereologicalEquipmentDao;
    this.stationReadDao = stationReadDao;
    this.pluviometerReadDao = pluviometerReadDao;
  }

  async execute(params) {
    // Futura melhoria = buscar dados das estações passando uma DATA
    const stations = await this.metereologicalEquipmentDao.getInmetStations();

    const pluviometers =
      await this.metereologicalEquipmentDao.getInmetPluviometers();

    const timeoutPromise = new Promise((resolve, reject) => {
      setTimeout(
        reject,
        scrapperConfig.toleranceTime,
        new Error(
          `Exceeded the tolerance time limit ${scrapperConfig.toleranceTime}`
        )
      );
    });

    const measures = await Promise.race([
      this.dataMiner.getMeasures({
        equipments_codes: {
          stations: stations.codes,
          pluviometers: pluviometers.codes,
        },
        ...scrapperConfig.params,
      }),
      timeoutPromise,
    ]);

    const { stationsMeasures, pluviometersMeasures } = measures;

    if (stations.equipments.length) {
      await this.stationReadDao.create(
        Mapper.stationsToPersistency(stations.equipments, stationsMeasures)
      );

      this.logs.addInfoLog("Sucesso ao salvar dados das medições de estação");
    }

    if (pluviometers.equipments.length) {
      await this.pluviometerReadDao.create(
        Mapper.pluviometerToPersistency(
          pluviometers.equipments,
          pluviometersMeasures
        )
      );
      this.logs.addInfoLog(
        "Sucesso ao salvar dados das medições de pluviômetros do INMET"
      );
    }
  }
}
