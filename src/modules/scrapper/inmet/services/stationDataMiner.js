import { setTimeout } from "node:timers/promises";

import scrapperConfig from "../../config/scrapper.js";

import { Command } from "../../core/commands/command.js";

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
    const equipments =
      await this.metereologicalEquipmentDao.getInmetEquipments();

    if (!equipments.length) {
      this.logs.addWarningLog("Não há equipamentos do INMET cadastradas");
      return;
    }

    const pluviometersEqp = equipments.filter(
      (eqp) => eqp.type === "pluviometer"
    );
    const pluviometersEqpCodes = pluviometersEqp.map((eqp) => eqp.code);

    const stationsEqp = equipments.filter((eqp) => eqp.type === "station");
    const stationsEqpCodes = stationsEqp.map((eqp) => eqp.code);

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
          stations: stationsEqpCodes,
          pluviometers: pluviometersEqpCodes,
        },
        ...scrapperConfig.params,
      }),
      timeoutPromise,
    ]);

    const { stationsMeasures, pluviometersMeasures } = measures;

    if (stationsEqp.length) {
      await this.stationReadDao.create(stationsEqp, stationsMeasures);

      this.logs.addInfoLog(
        "Sucesso ao salvar dados das medições de estação do INMET"
      );
    }

    if (pluviometersEqp.length) {
      // await this.pluviometerReadDao.create(
      //   pluviometersEqp,
      //   pluviometersMeasures
      // );
      // this.logs.addInfoLog(
      //   "Sucesso ao salvar dados das medições de pluviômetros do INMET"
      // );
    }
  }
}
