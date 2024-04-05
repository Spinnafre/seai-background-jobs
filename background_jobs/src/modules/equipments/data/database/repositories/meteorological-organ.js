import { connections } from "../connection.js";

export class MetereologicalOrganRepository {
  #connection;
  constructor() {
    this.#connection = connections.equipments;
  }

  async getOrganByName(organName) {
    const data = await this.#connection.raw(
      `SELECT * FROM "MetereologicalOrgan" AS ORGAN
       WHERE ORGAN."Name" = ?`,
      [organName]
    );

    if (data.rows.length) {
      return data.rows.map((organ) => ({
        id: organ.IdOrgan,
        host: organ.Host,
        user: organ.User,
        password: organ.Password,
      }))[0];
    }

    return null;
  }
}
