import Pg from "pg";
// import pg from "pg-boss";
import { Logger } from "../lib/logger/logger.js";
import { DB_CONFIG } from "../config/database.js";

// Helper
function makeValuesString(columnCount, rowCount) {
  return Array.from(
    { length: rowCount },
    (_, i) =>
      `(${Array.from(
        { length: columnCount },
        (_, j) => `$${i * columnCount + j + 1}`
      ).join(", ")})`
  ).join(", ");
}

class PgDAO {
  #connection = null;

  constructor(connection) {
    console.log("Estou sendo criado");
    this.#connection = connection;
  }
  static create() {
    const { Pool } = Pg;

    const connection = new Pool({
      database: DB_CONFIG.JOBS_DB.database,
      port: Number(DB_CONFIG.JOBS_DB.port),
      host: DB_CONFIG.JOBS_DB.host,
      password: DB_CONFIG.JOBS_DB.password,
      user: DB_CONFIG.JOBS_DB.user,
      idleTimeoutMillis: 20000,
      max: 20,
      min: 2,
      connectionTimeoutMillis: 2000,
    });

    const pgDao = new PgDAO(connection);

    pgDao.setListener("acquire", () => {
      Logger.info({
        msg: "Acquire connection...",
      });
    });

    pgDao.setListener("error", (error, client) => {
      Logger.error({
        msg: `Falha ao realizar conexão com o banco de dados de jobs`,
        obj: error,
      });
      throw error;
    });

    pgDao.setListener("connect", function () {
      Logger.info({
        msg: "[✅] Conectado com sucesso ao banco de dados de jobs",
      });
    });

    pgDao.setListener("release", (error, client) => {
      if (error)
        Logger.error({
          msg: "Error in release connection pool",
          obj: error,
        });
      Logger.info(`The client is released back into the pool`);
    });

    pgDao.setListener("remove", (client) => {
      Logger.info({
        msg: `The client has disconnected and removed from pool`,
      });
    });
    // pgDao.setListener("remove",())

    return pgDao;
  }

  getIddleConections() {
    this.#connection.idleCount;
  }
  getConnectedConections() {
    this.#connection.totalCount;
  }

  setListener(event, cb) {
    this.#connection.on(event, cb);
  }

  printPoolStatus() {
    Logger.info({
      msg: `
    ######################################################
      POOL STATUS:
      # Connections : ${this.getConnectedConections()}
      # Iddle Connections : ${this.getIddleConections()}
    ######################################################
    `,
    });
  }
  async startConnection() {
    Logger.info({ msg: "[⚙️] Creating a new connection to pool ..." });
    const newConnection = await this.#connection.connect();
    Logger.info({ msg: "[⚡] Connected successfully :)" });
    this.printPoolStatus();
    return newConnection;
  }

  // Return to connection poll or disconnect and destroy this client
  async releaseConnection(destroyConnection = false) {
    Logger.info({ msg: "Dropping connection..." });
    await this.#connection.release(destroyConnection);
  }

  // Disconnect all pool connections, very useful to gracefully shutdown
  async endConnectionsFromPool() {
    await this.#connection.end();
  }

  async schedule(name_queue, cron, data, options) {
    // await PgDAO.instance.schedule(name_queue, cron, data, options);
  }

  async fetchJobsStates() {
    const { rows } = await this.#connection.query(
      `SELECT     
       e.enumlabel AS states
        FROM
            pg_type t
        JOIN pg_enum e ON
            t.oid = e.enumtypid
        JOIN pg_catalog.pg_namespace n ON
            n.oid = t.typnamespace
        WHERE
            t.typname = 'job_state';`
    );

    return {
      states: rows,
    };
  }

  async fetchCronJobs({ page, queue }) {
    const args = [page];
    const whereSql = [];

    const params = [
      {
        value: queue,
        query: `WHERE  "name" = $2`,
      },
    ];

    params.forEach((command) => {
      if (command.value !== null || command.value !== undefined) {
        whereSql.push(command.query);
        args.push(command.value);
      }
    });

    const query = `
      SELECT "name", cron, timezone, "data", "options", created_on, updated_on
      FROM pgboss.schedule
      ${whereSql.join("")}
      LIMIT 50 OFFSET $1`;
    const { rowCount, rows } = await this.#connection.query(query, args);

    return {
      count: rowCount,
      page,
      value: rows,
    };
  }

  async fetchCreatedJobs({ page, state, queue }) {
    const whereClause = [`WHERE "name" NOT LIKE '__pgboss%'`];
    const args = [page];

    [
      { query: `"name" = $`, params: queue },
      { query: `"state" = $`, params: state },
    ].forEach((param, index) => {
      if (param.params) {
        whereClause.push(param.query.concat(args.length + 1));
        args.push(param.params);
      }
    });

    const { rowCount, rows } = await this.#connection.query(
      `SELECT id, "name", priority, "data", state, retrylimit, retrycount, retrydelay, retrybackoff, startafter, startedon, expirein, createdon, completedon, keepuntil, on_complete, "output"
      FROM pgboss.job
      ${whereClause.join(" AND ")}
      LIMIT 50 OFFSET $1;`,
      args
    );

    return {
      count: rowCount,
      page,
      value: rows,
    };
  }

  async registerJob(jobs = []) {
    const columns = ["name", "priority", "data", "retrylimit", "retrydelay"]; // columnNames

    const values = jobs.map((job) => [
      job.name,
      job.priority,
      job.data,
      job.retrylimit,
      job.retrydelay,
    ]);

    const query = {
      text: `INSERT INTO pgboss.job (${columns.join(", ")})
  VALUES ${makeValuesString(columns.length, jobs.length)} RETURNING *`,
      values: values.reduce((acc, current) => {
        acc.push(...current); // rowValues
        return acc;
      }, []),
    };

    const { rowCount, rows } = await this.#connection.query(query);

    return {
      rowCount,
      rows,
    };
  }
}

export const connection = PgDAO.create();
