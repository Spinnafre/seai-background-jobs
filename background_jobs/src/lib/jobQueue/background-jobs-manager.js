import { PgBoss } from "./pg-boss/connection.js";

import workers from "../../jobs/queue_handlers.js";

export class QueueManager {
  static client = null;

  static handlers = workers;

  static async processAllWorkers() {
    console.log("[⚡] Iniciando workers...");

    for (const task of QueueManager.handlers) {
      for (const worker of task.workers) {
        await QueueManager.registerWorker(task.queue_name, worker);
      }
    }

    console.log("[😉] Sucesso ao iniciar os workers...");
  }

  // static async registerSeed() {
  //   console.log("Registrando seeds...");

  //   for (const seed of seeds) {
  //     const { cron, data, options, queue } = seed;
  //     await QueueManager.scheduleJob(queue, cron, data, options);
  //   }
  // }

  static async connect() {
    this.client = await PgBoss.create();
    return this;
  }

  static async start() {
    console.log("[🔍] Iniciando monitoramento de jobs");

    await this.client.startMonitoring();

    console.log("[✅] Monitoramento iniciado com sucesso");

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
    const hasWorker = QueueManager.handlers.some(
      (handler) => handler.queue_name === name_queue
    );
    if (hasWorker === false) {
      console.error(
        `Não há nenhum worker registrado para a fila ${name_queue}`
      );
      return;
    }
    const id = await QueueManager.client.registerJob(name_queue, data, options);
    console.log(`[✅] JOB ${id} adicionado com sucesso na fila ${name_queue}`);
  }
}
