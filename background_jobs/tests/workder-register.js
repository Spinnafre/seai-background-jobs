import { BackgroundJobsManager } from "../src/lib/jobQueue/background-jobs-manager.js";
import { FuncemeScrapperCommand } from "../../background_jobs/src/jobs/scrapper/funceme/command-handler/funceme-scrapper-command.js";

import "dotenv/config.js";

import queue_jobs from "../src/queue_workers.js";

import { resolve } from "node:path";

console.log(process.env);

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

  const date = Intl.DateTimeFormat("pt-BR").format(yesterday);

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

  // await QueueManager.createJob(
  //   InmetScrapper.name_queue,
  //   { date },
  //   {
  //     singletonKey: "2",
  //     useSingletonQueue: true,
  //     startAfter: today,
  //     retryLimit: 1,
  //     retryDelay: 15,
  //   }
  // );
  process.exit(0);
}

register();
