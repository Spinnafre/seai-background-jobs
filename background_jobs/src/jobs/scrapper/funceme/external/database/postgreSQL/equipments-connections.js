import knex from "knex";

import { dbConfig } from "../../../../../../config/database.js";

export const equipment_connection = knex(dbConfig.equipments);
