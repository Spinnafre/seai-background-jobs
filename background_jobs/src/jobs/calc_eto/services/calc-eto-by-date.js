import { Logger } from "../../../lib/logger/logger.js";
import { ServiceProtocol } from "../../scrapper/core/service-protocol.js";
import { CalcEto } from "../domain/calc-eto.js";
export class CalcETO extends ServiceProtocol {
  #equipmentRepository;
  #stationReadsRepository;
  #etoRepository;

  constructor(equipmentRepository, etoRepository, stationReadsRepository) {
    super();
    this.#equipmentRepository = equipmentRepository;
    this.#stationReadsRepository = stationReadsRepository;
    this.#etoRepository = etoRepository;
  }

  /**
   * @param {CalcEtoDTO} date Instance of CalcEtoDTO class
   */
  async execute(date) {
    const year = date.getYear();
    const day = date.getDay();

    const dateToRemove = `${year}-${date.getMonth()}-${day}`;

    Logger.warn({
      msg: `Deletando dados de ETO do dia ${dateToRemove}`,
    });

    await this.#etoRepository.deleteByTime(dateToRemove);

    Logger.info({
      msg: `Calculando dados de ETO pela data ${day}/${date.getMonth()}/${year}`,
    });

    const stationsEqps = await this.#equipmentRepository.getEquipments({
      eqpType: "station",
    });

    const stationsEto = [];

    for (const station of stationsEqps) {
      // buscar leituras da estação usando o Fk_Equipment
      const stationReads =
        await this.#stationReadsRepository.getStationReadsByEquipment(
          station.id
        );

      // e se não tiver dados de leituras da estação?
      if (stationReads === null || stationReads.length === 0) {
        Logger.warn({
          msg: " Estação está sem dados de medições.",
        });

        this.logs.addWarningLog(
          `Não há dados de medições da estação ${station.code} de ${station.location}`
        );

        continue;
      }

      const altitude = station.altitude;

      for (const stationRead of stationReads) {
        const {
          idRead,
          atmosphericTemperature,
          totalRadiation,
          relativeHumidity,
        } = stationRead;

        if (atmosphericTemperature === null) {
          this.logs.addWarningLog(
            `Não irá computar os dados de ET0 pois não há dados de temperatura atmosférica média da estação ${station.code} de ${station.location}`
          );

          continue;
        }

        if (totalRadiation === null) {
          this.logs.addWarningLog(
            `Não há dados de radiação solar média da estação ${station.code} de ${station.location}, portanto irá ser estimado o valor da radiação solar.`
          );
        }

        if (relativeHumidity === null) {
          this.logs.addWarningLog(
            `Não há dados de umidade relativa média da estação ${station.code} de ${station.location}, portanto irá ser estimado o valor da umidade média.`
          );
        }

        const eto = CalcEto({
          date: {
            year,
            day,
          },
          altitude,
          atmosphericTemperatureAverage: atmosphericTemperature,
          relativeHumidityAverage: relativeHumidity,
          totalRadiationAverage: totalRadiation,
          sunQuantityHoursInDay: 11,
        });

        if ((eto === null) | (eto === undefined)) {
          this.logs.addErrorLog(
            `Não foi possível calcular ET0 da estação ${station.code} de ${station.location} pois não há dados de temperatura média.`
          );

          continue;
        }

        this.logs.addInfoLog(
          `Sucesso ao calcular dados de ET0 da estação ${station.code} de ${station.location}`
        );

        stationsEto.push({
          idRead,
          eto,
        });
      }

      if (stationsEto.length) {
        Logger.info({
          msg: "Salvando dados de ETO...",
        });

        await this.#etoRepository.add(stationsEto);

        this.logs.addInfoLog(`Sucesso ao calcular dados de ET0 do dia.`);
      } else {
        this.logs.addWarningLog(`Não foi possível calcular ET0 do dia.`);
      }
    }
  }
}
