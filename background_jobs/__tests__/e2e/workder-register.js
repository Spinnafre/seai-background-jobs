import { BackgroundJobsManager } from "../../src/lib/jobQueue/background-jobs-manager.js";
import { FuncemeScrapperCommand } from "../../src/jobs/scrapper/funceme/command-handler/funceme-scrapper-command.js";
import { CalcET0Handler } from "../../src/jobs/calc_eto/handler/handler.js";

import "dotenv/config.js";

import queue_jobs from "../../src/queue_workers.js";

async function register() {
  await BackgroundJobsManager.connectToQueue();

  await BackgroundJobsManager.startQueueMonitoring();

  await BackgroundJobsManager.registerAllWorkers(queue_jobs);

  await BackgroundJobsManager.createJob(
    FuncemeScrapperCommand.name_queue,
    { date: null },
    {
      // singletonKey: "1",
      useSingletonQueue: true,
      startAfter: today,
      retryLimit: 3,
      retryDelay: 15,
    }
  );

  await BackgroundJobsManager.createJob(
    CalcET0Handler.name_queue,
    { date: null },
    {
      singletonKey: "2",
      useSingletonQueue: true,
      startAfter: new Date(today).setHours(23, 8, 0),
      retryLimit: 3,
      retryDelay: 15,
    }
  );
}

register();
