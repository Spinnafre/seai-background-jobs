import { ServiceProtocol } from "../../scrapper/core/service-protocol.js";
import { CalcEto } from "../domain/calc-eto.js";
export class CalcETO extends ServiceProtocol {
  constructor(equipmentRepository, etoRepository, stationReadsRepository) {
    this.equipmentRepository = equipmentRepository;
    this.stationReadsRepository = stationReadsRepository;
    this.etoRepository = etoRepository;
  }

  async execute(date) {
    console.log("date ::: ", date);

    const stationsEqps = await this.equipmentRepository.getStations();

    const stationsEto = [];

    for (const station of stationsEqps) {
      // buscar leituras da estação usando o Fk_Equipment
      const stationReads =
        await this.stationReadsRepository.getStationReadsByEquipment(
          station.id
        );
      // TO-DO : buscar leituras de pluviometros pelo o ID da estação

      // const stationPluviometerReads = await this.pluviometerReadsRepository.getReadByIdAndDate(station.id,date)

      // e se não tiver dados de leituras da estação?
      if (stationReads === null) {
        console.log("Station is empty");
        continue;
      }

      const altitude = station.altitude;

      stationReads.forEach((stationRead) => {
        const {
          idRead,
          atmosphericTemperature,
          totalRadiation,
          relativeHumidity,
        } = stationRead;

        if (totalRadiation === null) {
          // avisar que está faltando dados de radiação
        }

        if (relativeHumidity === null) {
          // avisar que está faltando dados de humidade
        }

        if (atmosphericTemperature === null) {
          // avisar que está faltando dados de temperatura
        }

        const et0 = CalcEto({
          date,
          altitude,
          atmosphericTemperatureAverage: atmosphericTemperature,
          relativeHumidityAverage: relativeHumidity,
          totalRadiationAverage: totalRadiation,
          sunQuantityHoursInDay: 11,
        });

        console.log("[LOG] eto = ", et0);

        stationsEto.push({
          idRead,
          eto,
        });
      });
    }

    console.log("Salvando dados de ETO...");
    await this.etoRepository.add(stationsEto);
  }
}
