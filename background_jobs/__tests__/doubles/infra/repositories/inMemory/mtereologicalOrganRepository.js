export class MetereologicalOrganRepositoryInMemory {
  #data = [
    {
      IdOrgan: 1,
      Name: "FUNCEME",
      Host: "testr",
      User: "test",
      Password: "test",
    },
  ];
  constructor(
    data = [
      {
        IdOrgan: 1,
        Name: "FUNCEME",
        Host: "testr",
        User: "test",
        Password: "test",
      },
    ]
  ) {
    this.#data = data;
  }

  async getOrganByName(organName) {
    const organ = this.#data.find((organ) => organ.Name === organName);
    return organ
      ? {
          Id: organ.IdOrgan,
          Host: organ.Host,
          User: organ.User,
          Password: organ.Password,
        }
      : null;
  }
}
