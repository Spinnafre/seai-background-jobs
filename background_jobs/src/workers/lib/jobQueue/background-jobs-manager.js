import { Logger } from "../../../shared/logger.js";
import { PgBossAdapter } from "./pg-boss/connection.js";

export class BackgroundJobsManager {
  static client = null;

  static async registerAllWorkers(queue_jobs = []) {
    Logger.info({ msg: "[⚡] Iniciando workers..." });

    for (const task of queue_jobs) {
      for (const worker of task.workers) {
        await BackgroundJobsManager.registerWorker(task.queue_name, worker);
      }
    }

    Logger.info({
      msg: "[😉] Sucesso ao iniciar os workers...",
    });
  }

  static async scheduleCronJobs(jobs = []) {
    Logger.info({
      msg: "Registrando seeds...",
    });

    for (const job of jobs) {
      const { cron, data, options, queue } = job;
      await BackgroundJobsManager.scheduleCronJob(queue, cron, data, options);
    }
  }

  static async connectToQueue() {
    this.client = await PgBossAdapter.create();
    return this;
  }

  static async startQueueMonitoring() {
    Logger.info({
      msg: "[🔍] Iniciando monitoramento de jobs",
    });

    await this.client.startMonitoring();

    Logger.info({
      msg: "[✅] Monitoramento iniciado com sucesso",
    });

    return this;
  }

  static async scheduleCronJob(name_queue, cron, data, options) {
    await BackgroundJobsManager.client.schedule(
      name_queue,
      cron,
      data,
      options
    );
    Logger.info({
      msg: `[✅] CronJob agendado com sucesso para a fila ${name_queue}`,
    });
  }

  static async registerWorker(name_queue, worker) {
    Logger.info({
      msg: `[⚙️] Registrando worker ${worker.name} para a fila ${name_queue}`,
    });
    await BackgroundJobsManager.client.registerWorker(
      name_queue,
      worker.process
    );
  }

  static async createJob(name_queue, data, options) {
    // const hasWorker = BackgroundJobsManager.handlers.some(
    //   (handler) => handler.queue_name === name_queue
    // );
    // if (hasWorker === false) {
    //   console.error(
    //     `Não há nenhum worker registrado para a fila ${name_queue}`
    //   );
    //   return;
    // }
    const id = await BackgroundJobsManager.client.registerJob(
      name_queue,
      data,
      options
    );
    Logger.info({
      msg: `[✅] JOB ${id} adicionado com sucesso na fila ${name_queue}`,
    });
  }
}
