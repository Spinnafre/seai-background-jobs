import knex from "knex";

import { databaseConfig } from "../../../config/index.js";

export const connections = {
  logs: knex(databaseConfig.logs),
  newsletter: knex(databaseConfig.newsletter),
};
