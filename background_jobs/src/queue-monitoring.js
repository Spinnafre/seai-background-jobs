import "dotenv/config.js";
import { BackgroundJobsManager } from "./lib/jobQueue/background-jobs-manager.js";

import queue_jobs from "./queue_workers.js";
import { FuncemeScrapperCommand } from "./jobs/scrapper/funceme/command-handler/funceme-scrapper-command.js";
import { CalcET0Handler } from "./jobs/calc_eto/handler/handler.js";
import { Logger } from "./lib/logger/logger.js";

const cronJobs = [
  {
    queue: FuncemeScrapperCommand.name_queue,
    cron: "* * * * *",
    data: null,
    options: {
      tz: "America/Fortaleza",
      retryLimit: 3,
      retryDelay: 15,
    },
  },
  {
    queue: CalcET0Handler.name_queue,
    cron: "*/2 * * * *",
    data: null,
    options: {
      tz: "America/Fortaleza",
      retryLimit: 3,
      retryDelay: 15,
    },
  },
];

await BackgroundJobsManager.connectToQueue();

await BackgroundJobsManager.startQueueMonitoring();

await BackgroundJobsManager.scheduleCronJobs(cronJobs);

await BackgroundJobsManager.registerAllWorkers(queue_jobs);

process.on("uncaughtException", (error) => {
  Logger.error({
    obj: error,
    msg: `Erro na execução no monitoramento de workers.`,
  });
  process.exit(1);
});
