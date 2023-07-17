import knex from "knex";

import { dbConfig } from "../../../config/database.js";

export const logs_connection = knex(dbConfig.logs);
