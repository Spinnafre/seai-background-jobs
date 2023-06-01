import dotenv from "dotenv";

dotenv.config({});

import { QueueManager } from "../lib/jobQueue/manager.js";

async function processAllWorkers(queueManager) {
  const handlers = await import("./handlers.js");

  const tasks = Object.values(handlers).map((Handler) => {
    const worker_handler = new Handler();
    return {
      queue_name: Handler.name_queue,
      workers: [
        {
          name: worker_handler.constructor.name,
          process: worker_handler.handler,
        },
      ],
    };
  });

  console.log("[⚡] Iniciando workers...");

  for (const task of tasks) {
    for (const worker of task.workers) {
      await queueManager.registerWorker(task.queue_name, worker);
    }
  }

  console.log("[😉] Sucesso ao iniciar os workers...");
}

export async function run() {
  const manager = await QueueManager.getConnection();
  await processAllWorkers(manager);
}
