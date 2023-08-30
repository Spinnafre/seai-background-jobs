import knex from "knex";
import { dbConfig } from "../../../../config/database.js";

export const connections = () => {
  const databaseConfig = dbConfig();
  return {
    logs: knex(databaseConfig.logs),
    equipments: knex(databaseConfig.equipments),
  };
};
