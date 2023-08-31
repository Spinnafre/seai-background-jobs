import knex from "knex";

import { dbConfig } from "../../../../../../config/database.js";

export default knex(dbConfig().logs);
