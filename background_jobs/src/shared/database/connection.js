import knex from "knex";

import { databaseConfig } from "../../../src/config/index.js";

export const connections = {
  logs: knex(databaseConfig.logs),
  equipments: knex(databaseConfig.equipments),
  newsletter: knex(databaseConfig.newsletter),
};
