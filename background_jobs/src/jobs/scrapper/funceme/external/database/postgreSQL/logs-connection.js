import knex from "knex";

import { dbConfig } from "../../../../../../config/database.js";

export const logsConnection = () => knex(dbConfig().logs);
