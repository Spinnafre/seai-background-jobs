module.exports = {
  node_env: process.env.NODE_ENV,
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
      host: process.env.DB_JOB_HOST_PORT,
      port: process.env.DB_JOB_PORT_PORT,
      user: process.env.DB_JOB_USER_NAME_PORT,
      password: process.env.DB_JOB_PASSWORD_PORT,
      database: "postgres",
      connectionTimeoutMillis: 30000,
      idleTimeoutMillis: 15000,
      max: 8,
    },
  },
};
