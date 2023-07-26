import "dotenv/config.js";
import { BackgroundJobsManager } from "./lib/jobQueue/background-jobs-manager.js";

import queue_jobs from "./queue_workers.js";

const cronJobs = [
  {
    queue: "daily-scheduler",
    cron: "* * * * *",
    data: null,
    options: {
      tz: "America/Chicago",
    },
  },
];

await BackgroundJobsManager.connectToQueue();

await BackgroundJobsManager.startQueueMonitoring();

await BackgroundJobsManager.scheduleCronJobs(cronJobs);

await BackgroundJobsManager.registerAllWorkers(queue_jobs);

process.on("uncaughtException", (error) => {
  console.error(`[WORKERS] - Erro na execução. ${error}`);
  process.exit(1);
});
