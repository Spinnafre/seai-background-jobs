import knex from "knex";

import { databaseConfig, env } from "../../../src/config/index.js";
import { Logger } from "../../../src/shared/logger.js";

Logger.info({
  msg: `Connecting to the database in mode ${env}.`,
});

export const connections = {
  logs: knex(databaseConfig.logs),
  equipments: knex(databaseConfig.equipments),
};
