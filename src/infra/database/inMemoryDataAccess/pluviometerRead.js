export class PluviometerRead {
  #PluviometerRead = [
    {
      IdRead: "",
      Value: "",
      FK_Time: "",
      FK_Organ: "",
      FK_Equipment: "",
    },
  ];

  #ReadTime = [];

  async create(reads = []) {
    const toPersistency = reads.map((data) => {
      const { IdEquipment, measures, IdOrgan, IdTime } = data;

      const Value = Reflect.has(measures, "pluviometer")
        ? measures.pluviometer
        : null;

      return {
        IdRead: Math.round(Math.random() * 1000),
        Value,
        FK_Time: IdTime,
        FK_Organ: IdOrgan,
        FK_Equipment: IdEquipment,
      };
    });

    this.#PluviometerRead = [...toPersistency];
  }

  async list() {
    return this.#PluviometerRead;
  }

  async update(reads = []) {}
}
