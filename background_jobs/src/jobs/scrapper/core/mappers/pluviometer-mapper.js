export class PluviometerMapper {
  static mapMeasures(measures = []) {
    const [date, pluviometer] = Object.values(measures);

    return {
      date,
      pluviometer: parseFloat(pluviometer) || null,
    };
  }

  static pluviometerToPersistency(pluviometer, measure) {
    if (!measure) {
      console.log(
        `Não foi possível obter dados de medição do pluviômetro ${pluviometer.code}, salvando dados sem medições`
      );

      return {
        Value: null,
        FK_Organ: pluviometer.id_organ,
        FK_Equipment: pluviometer.id,
      };
    }

    // const { pluviometer } = measure;

    return {
      Value: measure.pluviometer,
      FK_Organ: pluviometer.id_organ,
      FK_Equipment: pluviometer.id,
    };
  }

  static pluviometersToPersistency(pluviometers = [], measures = []) {
    return pluviometers.map((pluviometer) => {
      const measure =
        measures && measures.find((item) => item.code === pluviometer.code);

      if (!measure) {
        console.log(
          `Não foi possível obter dados de medição do pluviômetro ${pluviometer.coce}, salvando dados sem medições`
        );

        return {
          Value: null,
          FK_Organ: pluviometer.id_organ,
          FK_Equipment: pluviometer.id,
        };
      }

      // const { pluviometer } = measure;

      return {
        Value: measure.pluviometer,
        FK_Organ: pluviometer.id_organ,
        FK_Equipment: pluviometer.id,
      };
    });
  }
}
