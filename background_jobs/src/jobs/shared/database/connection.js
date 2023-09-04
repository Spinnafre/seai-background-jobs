import knex from "knex";
import { dbConfig } from "../../../config/database.js";

export const connections = {
  logs: knex(dbConfig().logs),
  equipments: knex(dbConfig().equipments),
};
