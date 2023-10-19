import "dotenv/config.js";
import { BackgroundJobsManager } from "./lib/jobQueue/background-jobs-manager.js";

import { Logger } from "./lib/logger/logger.js";
import workers from "./queue_workers.js";
import { cronJobs } from "./config/cron.js";

await BackgroundJobsManager.connectToQueue();

await BackgroundJobsManager.startQueueMonitoring();

await BackgroundJobsManager.scheduleCronJobs(cronJobs);

await BackgroundJobsManager.registerAllWorkers(workers);

process.on("uncaughtException", (error) => {
  Logger.error({
    obj: error,
    msg: `Erro na execução no monitoramento de workers.`,
  });
  process.exit(1);
});
