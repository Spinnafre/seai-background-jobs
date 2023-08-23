export class EtoRepositoryInMemory {
  Values = [];

  async Add(reads = []) {
    const toPersistency = reads.map((read) => {
      return {
        Value: read.eto,
        FK_Station_Read: read.idRead,
      };
    });

    this.Values = [...this.Values, ...toPersistency];
  }
}
