export const dbConfig = {
  equipments: {
    client: "pg",
    host: process.env.DATABASE_HOST,
    port: process.env.DATABASE_PORT,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: "equipments",
  },
  logs: {
    client: "pg",
    host: process.env.DB_LOGS_HOST,
    port: process.env.DB_LOGS_PORT,
    user: process.env.DB_LOGS_USER,
    password: process.env.DB_LOGS_PASSWORD,
    database: "logs",
  },
};
