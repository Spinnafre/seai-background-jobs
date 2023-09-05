import knex from "knex";
import { databaseConfig, env } from "../../../config/app.js";
import { Logger } from "../../../lib/logger/logger.js";

Logger.info({
  msg: `Connecting to the database in mode ${env}.`,
});

export const connections = {
  logs: knex(databaseConfig.logs),
  equipments: knex(databaseConfig.equipments),
};
