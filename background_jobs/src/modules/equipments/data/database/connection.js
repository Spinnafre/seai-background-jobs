import knex from "knex";
import { databaseConfig } from "../../../../config.js";

export const connections = {
  logs: knex(databaseConfig.logs),
  equipments: knex(databaseConfig.equipments),
};
