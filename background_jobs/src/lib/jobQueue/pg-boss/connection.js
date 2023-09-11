// import { dbConfig } from "../../../config/database.js";
import { Logger } from "../../logger/logger.js";

export class PgBossAdapter {
  _boss;

  static instance = null;

  constructor(connection) {
    this._boss = connection;
  }

  async startMonitoring() {
    // Prepares the target database and begins job monitoring.
    await this._boss.start();
  }

  static async create() {
    if (!PgBossAdapter.isInitialized()) {
      const { default: pg } = await import("pg-boss");

      Logger.info({
        msg: "[⚙️] Criando conexão com o banco de dados de jobs",
      });

      // const connection = new pg("postgres://postgres:iaes@jobs_database:5432");
      const connection = new pg({
        database: "postgres",
        port: 5432,
        host: "jobs_database",
        password: "iaes",
        user: "postgres",
      });

      connection.on("error", (error) => {
        Logger.error({
          msg: `Falha ao realizar conexão com o banco de dados de JOBS`,
          obj: error,
        });

        throw error;
      });

      Logger.info({
        msg: "[✅] Conexão iniciada com sucesso",
      });

      PgBossAdapter.instance = new PgBossAdapter(connection);
    }

    return PgBossAdapter.instance;
  }

  static isInitialized() {
    return PgBossAdapter.instance !== null;
  }

  // async start() {
  //   await this._boss.start();
  //   return this;
  // }

  async schedule(name_queue, cron, data, options) {
    await this._boss.schedule(name_queue, cron, data, options);
  }

  async fetch(name_queue, qtd) {
    return await this._boss.fetch(name_queue, qtd);
  }

  async registerJob(name_queue, data, options) {
    return this._boss.send(name_queue, data, options);
  }

  async registerWorker(name_queue, handler) {
    await this._boss.work(name_queue, handler);
  }
}
