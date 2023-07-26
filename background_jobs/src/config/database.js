export const dbConfig = {
  equipments: {
    client: "pg",
    connection: {
      host: process.env.DATABASE_HOST,
      port: Number(process.env.DATABASE_PORT),
      user: process.env.DATABASE_USER,
      password: process.env.DATABASE_PASSWORD,
      database: "equipments",
    },
    pool: {
      min: 2,
      max: 10,
    },
  },
  logs: {
    client: "pg",
    connection: {
      host: process.env.DB_LOGS_HOST,
      port: Number(process.env.DB_LOGS_PORT),
      user: process.env.DB_LOGS_USER_NAME,
      password: process.env.DB_LOGS_PASSWORD,
      database: "logs",
    },
    pool: {
      min: 2,
      max: 10,
    },
  },
  jobs: {
    // client: "pg",
    host: process.env.DB_JOB_HOST,
    port: Number(process.env.DB_JOB_PORT),
    user: process.env.DB_JOB_USER_NAME,
    password: process.env.DB_JOB_PASSWORD,
    database: "postgres",
  },
};
