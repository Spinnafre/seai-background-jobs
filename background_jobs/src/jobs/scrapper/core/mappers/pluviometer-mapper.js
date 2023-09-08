import { Logger } from "../../../../lib/logger/logger.js";

export class PluviometerMapper {
  static mapMeasures(measures = []) {
    const [date, pluviometer] = Object.values(measures);

    return {
      date,
      pluviometer: parseFloat(pluviometer) || null,
    };
  }

  static pluviometerToPersistency(pluviometer, measure, date = null) {
    const data = {
      Value: null,
      FK_Organ: pluviometer.id_organ,
      FK_Equipment: pluviometer.id,
    };

    if (date)
      Object.assign(data, {
        Time: date,
      });

    if (!measure) {
      Logger.warn({
        msg: `Não foi possível obter dados de medição do pluviômetro ${pluviometer.code}, salvando dados sem medições`,
      });

      return data;
    }

    // const { pluviometer } = measure;

    return Object.assign(data, {
      Value: measure.pluviometer,
    });
  }

  static pluviometersToPersistency(
    pluviometers = [],
    measures = [],
    date = null
  ) {
    return pluviometers.map((pluviometer) => {
      const data = {
        Value: null,
        FK_Organ: pluviometer.id_organ,
        FK_Equipment: pluviometer.id,
      };

      if (date)
        Object.assign(data, {
          Time: date,
        });

      const measure =
        measures && measures.find((item) => item.code === pluviometer.code);

      if (!measure) {
        Logger.warn({
          msg: `Não foi possível obter dados de medição do pluviômetro ${pluviometer.coce}, salvando dados sem medições`,
        });

        return data;
      }

      // const { pluviometer } = measure;

      return Object.assign(data, {
        Value: measure.pluviometer,
      });
    });
  }
}
