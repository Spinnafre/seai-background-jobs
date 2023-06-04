import { QueueManager } from "../lib/jobQueue/manager.js";

const seeds = [
  {
    queue: "daily-scheduler",
    cron: "* * * * *",
    data: null,
    options: {
      tz: "America/Chicago",
    },
  },
];

async function processAllWorkers() {
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
      await QueueManager.registerWorker(task.queue_name, worker);
    }
  }

  console.log("[😉] Sucesso ao iniciar os workers...");
}

async function registerSeed() {
  console.log("Registrando seeds...");
  for (const seed of seeds) {
    const { cron, data, options, queue } = seed;
    await QueueManager.scheduleJob(queue, cron, data, options);
  }
}

export async function run() {
  await QueueManager.start();

  await processAllWorkers();

  if (seeds) {
    await registerSeed();
  }
}
