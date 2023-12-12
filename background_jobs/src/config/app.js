import { config } from "dotenv";

config({
  path: ".env",
});

export const env = process.env.NODE_ENV || "test";

const databaseCredentials = {
  development: {
    equipments: {
      client: "pg",
      connection: {
        host: process.env.DATABASE_HOST_DEV,
        port: Number(process.env.DATABASE_PORT_DEV),
        user: process.env.DATABASE_USER_DEV,
        password: process.env.DATABASE_PASSWORD_DEV,
        database: "equipments",
      },
      pool: {
        min: 0,
        max: 10,
      },
    },
    logs: {
      client: "pg",
      connection: {
        host: process.env.DB_LOGS_HOST_DEV,
        port: Number(process.env.DB_LOGS_PORT_DEV),
        user: process.env.DB_LOGS_USER_NAME_DEV,
        password: process.env.DB_LOGS_PASSWORD_DEV,
        database: "logs",
      },
      pool: {
        min: 0,
        max: 10,
      },
    },
    jobs: {
      // client: "pg",
      host: process.env.DB_JOB_HOST_DEV,
      port: Number(process.env.DB_JOB_PORT_DEV),
      user: process.env.DB_JOB_USER_NAME_DEV,
      password: process.env.DB_JOB_PASSWORD_DEV,
      database: process.env.DB_JOB_NAME_DEV,
    },
    newsletter: {
      client: "pg",
      connection: {
        host: process.env.DB_NEWSLETTER_HOST_DEV,
        port: Number(process.env.DB_NEWSLETTER_PORT_DEV),
        user: process.env.DB_NEWSLETTER_USER_NAME_DEV,
        password: process.env.DB_NEWSLETTER_PASSWORD_DEV,
        database: "newsletter",
      },
      pool: {
        min: 0,
        max: 10,
      },
    },
  },
  production: {
    equipments: {
      client: "pg",
      connection: {
        host: process.env.DATABASE_HOST_PROD,
        port: Number(process.env.DATABASE_PORT_PROD),
        user: process.env.DATABASE_USER_PROD,
        password: process.env.DATABASE_PASSWORD_PROD,
        database: "equipments",
      },
      pool: {
        min: 0,
        max: 10,
      },
    },
    logs: {
      client: "pg",
      connection: {
        host: process.env.DB_LOGS_HOST_PROD,
        port: Number(process.env.DB_LOGS_PORT_PROD),
        user: process.env.DB_LOGS_USER_NAME_PROD,
        password: process.env.DB_LOGS_PASSWORD_PROD,
        database: "logs",
      },
      pool: {
        min: 0,
        max: 10,
      },
    },
    jobs: {
      // client: "pg",
      host: process.env.DB_JOB_HOST_PROD,
      port: Number(process.env.DB_JOB_PORT_PROD),
      user: process.env.DB_JOB_USER_NAME_PROD,
      password: process.env.DB_JOB_PASSWORD_PROD,
      database: process.env.DB_JOB_NAME_PROD,
    },
    newsletter: {
      client: "pg",
      connection: {
        host: process.env.DB_NEWSLETTER_HOST_PROD,
        port: Number(process.env.DB_NEWSLETTER_PORT_PROD),
        user: process.env.DB_NEWSLETTER_USER_NAME_PROD,
        password: process.env.DB_NEWSLETTER_PASSWORD_PROD,
        database: "newsletter",
      },
      pool: {
        min: 0,
        max: 10,
      },
    },
  },
  test: {
    equipments: {
      client: "pg",
      connection: {
        host: process.env.DATABASE_HOST_TEST,
        port: Number(process.env.DATABASE_PORT_TEST),
        user: process.env.DATABASE_USER_TEST,
        password: process.env.DATABASE_PASSWORD_TEST,
        database: "equipments",
      },
      pool: {
        min: 0,
        max: 10,
      },
    },
    logs: {
      client: "pg",
      connection: {
        host: process.env.DB_LOGS_HOST_TEST,
        port: Number(process.env.DB_LOGS_PORT_TEST),
        user: process.env.DB_LOGS_USER_NAME_TEST,
        password: process.env.DB_LOGS_PASSWORD_TEST,
        database: "logs",
      },
      pool: {
        min: 0,
        max: 10,
      },
    },
    jobs: {
      // client: "pg",
      host: process.env.DB_JOB_HOST_TEST,
      port: Number(process.env.DB_JOB_PORT_TEST),
      user: process.env.DB_JOB_USER_NAME_TEST,
      password: process.env.DB_JOB_PASSWORD_TEST,
      database: process.env.DB_JOB_NAME_TEST,
    },
    newsletter: {
      client: "pg",
      connection: {
        host: process.env.DB_NEWSLETTER_HOST_TEST,
        port: Number(process.env.DB_NEWSLETTER_PORT_TEST),
        user: process.env.DB_NEWSLETTER_USER_NAME_TEST,
        password: process.env.DB_NEWSLETTER_PASSWORD_TEST,
        database: "newsletter",
      },
      pool: {
        min: 0,
        max: 10,
      },
    },
  },
};

export const databaseConfig = databaseCredentials[env];
