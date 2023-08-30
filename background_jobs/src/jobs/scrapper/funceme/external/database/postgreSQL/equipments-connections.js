import knex from "knex";

import { dbConfig } from "../../../../../../config/database.js";

export const equipmentConnection = () => knex(dbConfig().equipments);
