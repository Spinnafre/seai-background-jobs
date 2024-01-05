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
      idleTimeoutMillis: 30000,
      max: 10,
      connectionTimeoutMillis: 2000,
      allowExitOnIdle: false,
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

  async createSchedule(request) {
    const { queue, cron, timezone, data, options } = request;

    await this.#connection.query(
      `
      INSERT INTO pgboss.schedule
      ("name", cron, timezone, "data", "options", updated_on)
      VALUES($1, $2, $3, $4, $5, now());
    `,
      [queue, cron, timezone, data, options]
    );
  }

  async deleteSchedule(queueName) {
    await this.#connection.query(
      `
      DELETE FROM pgboss.schedule
      WHERE "name"= $1;
    `,
      [queueName]
    );
  }

  async updateSchedule(request) {
    const { queue, cron, timezone, data, options } = request;

    await this.#connection.query(
      `
      UPDATE pgboss.schedule
      SET cron=$2, timezone=$3, "data"=$4, "options"=$5
      WHERE "name"=$1;
    `,
      [queue, cron, timezone, data, options]
    );
  }

  async fetchScheduleByQueueName(queue) {
    const { rows } = await this.#connection.query(
      `
      SELECT "name", cron, timezone, "data", "options", created_on, updated_on
      FROM pgboss.schedule
      WHERE "name"=$1;
    `,
      [queue]
    );

    console.log("schedule :: ", rows);

    if (!rows.length) {
      return null;
    }

    const schedule = rows[0];

    return schedule;
  }

  async fetchJobsStates() {
    const { rows, rowCount } = await this.#connection.query(
      `SELECT     
       e.enumlabel AS state
        FROM
            pg_type t
        JOIN pg_enum e ON
            t.oid = e.enumtypid
        JOIN pg_catalog.pg_namespace n ON
            n.oid = t.typnamespace
        WHERE
            t.typname = 'job_state';`
    );

    return rows;
  }

  async fetchCronJobs({ page, queue }) {
    const limit = 50;
    const pageNumber = Number(page) || 1;
    const pageOffset = pageNumber ? (pageNumber - 1) * limit : 0;
    const args = [pageOffset];
    const whereQueries = [];
    const whereClause = [];

    let baseQuery = `SELECT "name", cron, timezone, "data", "options", created_on, updated_on
      FROM pgboss.schedule \n`;

    if (queue) {
      whereQueries.push({ query: `"name" = $`, params: queue });
    }

    if (whereQueries.length) {
      whereQueries.forEach((param) => {
        if (param.params) {
          whereClause.push(param.query.concat(args.length + 1));
          args.push(param.params);
        }
      });

      baseQuery += `WHERE ${whereClause.join(" AND ")} \n`;
    }

    baseQuery += "LIMIT 50 OFFSET $1;";

    console.log(baseQuery);

    const { rowCount, rows } = await this.#connection.query(baseQuery, args);

    return {
      count: rowCount,
      page: pageNumber,
      limit,
      value: rows,
    };
  }

  async fetchJobs({ page, state, queue }) {
    const whereClause = [`WHERE "name" NOT LIKE '__pgboss%'`];
    const limit = 50;
    const pageNumber = Number(page) || 1;
    const pageOffset = pageNumber ? (pageNumber - 1) * limit : 0;
    const args = [pageOffset];

    const whereQueries = [];

    if (queue) {
      whereQueries.push({ query: `"name" = $`, params: queue });
    }

    if (state) {
      whereQueries.push({ query: `"state" = $`, params: state });
    }

    let baseQuery = `SELECT id, "name", priority, "data", state, retrylimit, retrycount, retrydelay, retrybackoff, startafter, startedon, expirein, createdon, completedon, keepuntil, on_complete, "output"
      FROM pgboss.job \n`;

    if (whereQueries.length) {
      whereQueries.forEach((param) => {
        if (param.params) {
          whereClause.push(param.query.concat(args.length + 1));
          args.push(param.params);
        }
      });
    }

    baseQuery += `${whereClause.join(" AND ")}`;

    baseQuery += "\n LIMIT 50 OFFSET $1;";

    const { rowCount, rows } = await this.#connection.query(baseQuery, args);

    return {
      count: rowCount,
      page: pageNumber,
      limit,
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
