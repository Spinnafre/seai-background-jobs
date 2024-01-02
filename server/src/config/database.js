import { serverConfig } from "../config/server.js";

const configs = {
  jobs: {
    development: {
      // client: "pg",
      host: process.env.DB_JOB_HOST_DEV,
      port: process.env.DB_JOB_PORT_DEV,
      user: process.env.DB_JOB_USER_NAME_DEV,
      password: process.env.DB_JOB_PASSWORD_DEV,
      database: "postgres",
      connectionTimeoutMillis: 30000,
      idleTimeoutMillis: 15000,
      max: 8,
    },
    production: {
      // client: "pg",
      host: process.env.DB_JOB_HOST_PROD,
      port: process.env.DB_JOB_PORT_PROD,
      user: process.env.DB_JOB_USER_NAME_PROD,
      password: process.env.DB_JOB_PASSWORD_PROD,
      database: "postgres",
      connectionTimeoutMillis: 30000,
      idleTimeoutMillis: 15000,
      max: 8,
    },
  },
};

export const DB_CONFIG = {
  JOBS_DB: configs.jobs[serverConfig.ENV],
};
