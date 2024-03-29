import { Logger } from "../../../shared/logger.js";
import { ServiceProtocol } from "../../equipments/core/service-protocol.js";
import { CalcEto } from "../domain/calc-eto.js";

export class CalcETOService extends ServiceProtocol {
  constructor() {
    super();
  }
  async calc(station, year, day) {
    if (!station) {
      Logger.warn({
        msg: "Não há equipamentos de estação cadastrados.",
      });

      this.logs.addErrorLog({
        message: "Não há equipamentos de estação cadastrados.",
      });

      return null;
    }

    /**
     {
        Code: 'A354',
        Name: 'OEIRAS',
        Latitude: '-6.974135',
        Altitude: '154.03',
        Longitude: '-42.146831',
        FK_Organ: 1,
        Measurements: {
          Time: '2023-10-01',
          AverageAtmosphericTemperature: 30.23,
          MaxAtmosphericTemperature: 31.65,
          MinAtmosphericTemperature: 29.08,
          AverageRelativeHumidity: 30.04,
          MaxRelativeHumidity: 33.21,
          MinRelativeHumidity: 26.83,
          AtmosphericPressure: 992.46,
          WindVelocity: 99.72,
          TotalRadiation: null
        }
      }
     */

    // buscar leituras da estação usando o Fk_Equipment

    // e se não tiver dados de leituras da estação?
    if (station.Measurements === null) {
      Logger.warn({
        msg: " Estação está sem dados de medições.",
      });

      this.logs.addWarningLog({
        message: `Não há dados de medições da estação ${station.Code}`,
        raw: {
          equipment: station.Code,
        },
      });

      return null;
    }

    const Altitude = station.Altitude;

    const {
      AverageAtmosphericTemperature,
      MinAtmosphericTemperature,
      MaxAtmosphericTemperature,
      AverageRelativeHumidity,
      MaxRelativeHumidity,
      MinRelativeHumidity,
      AtmosphericPressure,
      TotalRadiation,
      WindVelocity,
    } = station.Measurements;

    if (AverageAtmosphericTemperature === null) {
      this.logs.addWarningLog({
        message: `Não irá computar os dados de ET0 pois não há dados de temperatura atmosférica média da estação ${station.Code}`,
        raw: { equipment: station.Code },
      });

      return null;
    }

    if (
      MinAtmosphericTemperature === null ||
      MaxAtmosphericTemperature === null
    ) {
      this.logs.addWarningLog({
        message: `Não há dados de temperatura máxima ou mínima da estação ${station.Code}, portanto os valores irão serem estimados.`,
        raw: { equipment: station.Code },
      });
    }

    if (TotalRadiation === null) {
      this.logs.addWarningLog({
        message: `Não há dados de radiação solar média da estação ${station.Code}, portanto irá ser estimado o valor da radiação solar.`,
        raw: { equipment: station.Code },
      });
    }

    if (AtmosphericPressure === null) {
      this.logs.addWarningLog({
        message: `Não há dados de pressão atmosférica da estação ${station.Code}, portanto o valor irá ser estimado.`,
        raw: { equipment: station.Code },
      });
    }

    if (WindVelocity === null) {
      this.logs.addWarningLog({
        message: `Não há dados da velocidade média do vento da estação ${station.Code}, portanto irá ser adotado o valor de referência de 2 m/s.`,
        raw: { equipment: station.Code },
      });
    }

    if (AverageRelativeHumidity === null) {
      this.logs.addWarningLog({
        message: `Não há dados de umidade relativa média da estação ${station.Code}, portanto irá ser estimado o valor da umidade média.`,
        raw: { equipment: station.Code },
      });
    }

    const eto = CalcEto({
      date: {
        year,
        day,
      },
      measures: {
        altitude: Altitude,
        sunQuantityHoursInDay: 11,
        averageAtmosphericTemperature: AverageAtmosphericTemperature,
        minAtmosphericTemperature: MinAtmosphericTemperature,
        maxAtmosphericTemperature: MaxAtmosphericTemperature,
        averageRelativeHumidity: AverageRelativeHumidity,
        maxRelativeHumidity: MaxRelativeHumidity,
        minRelativeHumidity: MinRelativeHumidity,
        atmosphericPressure: AtmosphericPressure,
        totalRadiation: TotalRadiation,
        windVelocity: WindVelocity,
      },
    });

    if ((eto === null) | (eto === undefined)) {
      this.logs.addErrorLog({
        message: `Não foi possível calcular ET0 da estação ${station.Code} pois não há dados de temperatura média.`,
        raw: { equipment: station.Code },
      });

      return null;
    }

    this.logs.addInfoLog({
      message: `Sucesso ao calcular dados de ET0 da estação ${station.Code}`,
      raw: { equipment: station.Code },
    });

    return eto;
  }
}
