import { PgBossAdapter } from "./pg-boss/adapter.js";

export class QueueManager {
  static client = null;

  static async getConnection() {
    console.log("[🔍] Iniciando conexão com o banco de dados de filas...");
    this.client = await PgBossAdapter.getConnection();
    return this;
  }

  static async scheduleJob(name_queue, cron, data, options) {
    await QueueManager.client.schedule(name_queue, cron, data, options);
    console.log(`[✅] CronJob agendado com sucesso para a fila ${name_queue}`);
  }

  static async registerWorker(name_queue, worker) {
    console.log(
      `[⚙️] Registrando worker ${worker.name} para a fila ${name_queue}`
    );
    await QueueManager.client.registerWorker(name_queue, worker.process);
  }

  static async createJob(name_queue, data, options) {
    const id = await QueueManager.client.registerJob(name_queue, data, options);
    console.log(`[✅] JOB ${id} adicionado com sucesso na fila ${name_queue}`);
  }
}
