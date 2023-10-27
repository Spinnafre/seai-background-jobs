import "dotenv/config.js";

import { Logger } from "./shared/logger.js";

import workers from "./workers/workers.js";
import { cronJobs } from "./workers/cron.js";
import { BackgroundJobsManager } from "./workers/lib/jobQueue/background-jobs-manager.js";

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
