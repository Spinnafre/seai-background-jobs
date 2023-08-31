import knex from "knex";
import { dbConfig } from "../../../../config/database.js";

// export const connections = () => {
//   const databaseConfig = dbConfig();
//   return {
//     logs: knex(databaseConfig.logs),
//     equipments: knex(databaseConfig.equipments),
//   };
// };
export const connections = {
  logs: knex(dbConfig().logs),
  equipments: knex(dbConfig().equipments),
};
