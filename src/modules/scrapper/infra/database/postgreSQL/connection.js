import dotenv from "dotenv";

import knex from "knex";
import path from "node:path";

dotenv.config({
  path: path.resolve("..", "..", "inmetscrapper", ".env"),
});

const equipmentsConnection = knex({
  client: "pg",
  connection: {
    host: process.env.DATABASE_HOST,
    port: process.env.DATABASE_PORT,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: "equipments",
  },
});
const logsConnection = knex({
  client: "pg",
  connection: {
    host: process.env.DATABASE_HOST,
    port: process.env.DATABASE_PORT,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: "logs",
  },
});

export { equipmentsConnection, logsConnection };
