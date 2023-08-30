import { BackgroundJobsManager } from "../../src/lib/jobQueue/background-jobs-manager.js";
import { FuncemeScrapperCommand } from "../../src/jobs/scrapper/funceme/command-handler/funceme-scrapper-command.js";
import { CalcET0Handler } from "../../src/jobs/calc_eto/handler/handler.js";

import "dotenv/config.js";

import queue_jobs from "../../src/queue_workers.js";

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

async function register() {
  const today = new Date();
  const yesterday = new Date(today);

  yesterday.setDate(yesterday.getDate() - 1);
  today.setHours(23, 0, 0);
  console.log(today.getTime(), ":::", yesterday.getTime());

  const date = yesterday;

  await BackgroundJobsManager.connectToQueue();

  await BackgroundJobsManager.startQueueMonitoring();

  await BackgroundJobsManager.scheduleCronJobs(cronJobs);

  await BackgroundJobsManager.registerAllWorkers(queue_jobs);

  await BackgroundJobsManager.createJob(
    FuncemeScrapperCommand.name_queue,
    { date },
    {
      // singletonKey: "1",
      useSingletonQueue: true,
      // startAfter: today,
      retryLimit: 3,
      retryDelay: 15,
    }
  );

  await BackgroundJobsManager.createJob(
    CalcET0Handler.name_queue,
    { date },
    {
      singletonKey: "2",
      useSingletonQueue: true,
      // startAfter: today.setHours(0, 8, 0),
      retryLimit: 3,
      retryDelay: 15,
    }
  );
}

register();
