export class PluviometerRead {
  #PluviometerRead = [];

  async getPluviometersReadsByDate(idEqp, idOrgan, date) {
    const data = this.#PluviometerRead.filter((read) => {
      return (
        read.FK_Equipment === idEqp &&
        read.Time === date &&
        read.FK_Organ === idOrgan
      );
    });

    if (!data) {
      return null;
    }

    return data.map((read) => {
      return {
        idRead: read.IdRead,
        time: read.Time,
      };
    });
  }

  async create(measures) {
    const data = measures.map((read) => ({
      IdRead: Math.round(Math.random() * 1000),
      ...read,
    }));

    this.#PluviometerRead = [...data];

    return data.map((read) => ({
      idRead: read.IdRead,
      date: read.Time,
    }));
  }

  async list() {
    return this.#PluviometerRead;
  }
}
