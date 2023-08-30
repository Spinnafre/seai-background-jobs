import { ServiceProtocol } from "../../scrapper/core/service-protocol.js";
import { CalcEto } from "../domain/calc-eto.js";
export class CalcETO extends ServiceProtocol {
  #equipmentRepository;
  #stationReadsRepository;
  #etoRepository;
  #logRepository;
  constructor(
    equipmentRepository,
    etoRepository,
    stationReadsRepository,
    logRepository
  ) {
    super();
    this.#equipmentRepository = equipmentRepository;
    this.#stationReadsRepository = stationReadsRepository;
    this.#etoRepository = etoRepository;
    this.#logRepository = logRepository;
  }

  /**
   * @param {CalcEtoDTO} date Instance of CalcEtoDTO class
   */
  async execute(date) {
    const year = date.getYear();
    const day = date.getDay();

    const stationsEqps = await this.#equipmentRepository.getStations();
    console.log("stationsEqps ::: ", stationsEqps);
    const stationsEto = [];

    const logs = [];

    for (const station of stationsEqps) {
      // buscar leituras da estação usando o Fk_Equipment
      const stationReads =
        await this.#stationReadsRepository.getStationReadsByEquipment(
          station.id
        );

      console.log("stationReads ::: ", stationReads);

      // e se não tiver dados de leituras da estação?
      if (stationReads === null || stationReads.length === 0) {
        console.log("Estação está sem dados de medições.");

        logs.push({
          type: "warning",
          message: `Não há dados de medições da estação ${station.code} de ${station.location}`,
        });

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
          logs.push({
            type: "warning",
            message: `Não irá computar os dados de ET0 pois não há dados de temperatura atmosférica média da estação ${station.code} de ${station.location}`,
          });

          continue;
        }

        if (totalRadiation === null) {
          logs.push({
            type: "warning",
            message: `Não há dados de radiação solar média da estação ${station.code} de ${station.location}, portanto irá ser estimado o valor da radiação solar.`,
          });
        }

        if (relativeHumidity === null) {
          logs.push({
            type: "warning",
            message: `Não há dados de umidade relativa média da estação ${station.code} de ${station.location}, portanto irá ser estimado o valor da umidade média.`,
          });
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
          logs.push({
            type: "error",
            message: `Não foi possível calcular ET0 da estação ${station.code} de ${station.location} pois não há dados de temperatura média.`,
          });
          continue;
        }

        logs.push({
          type: "info",
          message: `Sucesso ao calcular dados de ET0 da estação ${station.code} de ${station.location}`,
        });

        stationsEto.push({
          idRead,
          eto,
        });
      }
    }

    if (stationsEto.length) {
      console.log("Salvando dados de ETO...");

      await this.#etoRepository.add(stationsEto);

      logs.push({
        type: "info",
        message: `Sucesso ao calcular dados de ET0 do dia.`,
      });
    } else {
      logs.push({
        type: "warning",
        message: `Não foi possível calcular ET0 do dia.`,
      });
    }

    await this.#logRepository.create(logs);
  }
}
