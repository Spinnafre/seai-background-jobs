export class EtoRepositoryInMemory {
  Values = [];

  async add(reads = []) {
    const toPersistency = reads.map((read) => {
      return {
        Value: read.eto,
        FK_Station_Read: read.idRead,
      };
    });

    this.Values = [...this.Values, ...toPersistency];
  }

  async getValuesByStation(idStation) {
    return this.Values.filter((value) => value.FK_Station_Read === idStation);
  }
}
