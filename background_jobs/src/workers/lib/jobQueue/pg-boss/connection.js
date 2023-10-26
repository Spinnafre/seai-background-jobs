import { Logger } from "../../../../shared/logger.js";
import { databaseConfig } from "../../../../config/app.js";

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

      const connection = new pg({
        database: databaseConfig.jobs.database,
        port: databaseConfig.jobs.port,
        host: databaseConfig.jobs.host,
        password: databaseConfig.jobs.password,
        user: databaseConfig.jobs.user,
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
