import pg from "pg-boss";
import { Logger } from "../lib/logger/logger.js";
import { DB_CONFIG } from "../config/database.js";

export class PgBossAdapter {
  static instance = null;

  static async createConnection() {
    return new Promise((resolve, reject) => {
      if (PgBossAdapter.isInitialized() == false) {
        Logger.info({
          msg: "[⚙️] Criando conexão com o banco de dados de jobs",
        });

        const connection = new pg({
          database: DB_CONFIG.JOBS_DB.database,
          port: DB_CONFIG.JOBS_DB.port,
          host: DB_CONFIG.JOBS_DB.host,
          password: DB_CONFIG.JOBS_DB.password,
          user: DB_CONFIG.JOBS_DB.user,
        });

        connection.on("error", (error) => {
          Logger.error({
            msg: `Falha ao realizar conexão com o banco de dados de JOBS`,
          });
          return reject(error);
        });

        Logger.info({
          msg: "[✅] Conexão iniciada com sucesso",
        });

        PgBossAdapter.instance = connection;
      }

      return resolve(true);
    });
  }

  static isInitialized() {
    return PgBossAdapter.instance !== null;
  }

  static async schedule(name_queue, cron, data, options) {
    await PgBossAdapter.instance.schedule(name_queue, cron, data, options);
  }

  static async fetchSchedules(name_queue) {
    return await PgBossAdapter.instance.fetch(name_queue);
  }

  async registerJob(name_queue, data, options) {
    return PgBossAdapter.instance.send(name_queue, data, options);
  }
}
