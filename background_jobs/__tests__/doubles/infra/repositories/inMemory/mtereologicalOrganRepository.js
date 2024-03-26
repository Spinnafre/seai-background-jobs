export class MetereologicalOrganRepositoryInMemory {
  #data = [
    {
      IdOgan: 1,
      Name: "FUNCEME",
      Host: "testr",
      User: "test",
      Password: "test",
    },
  ];
  constructor(
    data = [
      {
        IdOgan: 1,
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
    const data = this.#data.filter((organ) => organ.Name === organName);
    return data.length
      ? data.map((organ) => {
          return {
            id: organ.IdOgan,
            host: organ.Host,
            user: organ.User,
            password: organ.Password,
          };
        })
      : null;
  }
}
