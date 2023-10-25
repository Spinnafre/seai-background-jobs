import "dotenv/config.js";

import workers from "../../src/workers/workers.js";
import { BackgroundJobsManager } from "../../src/workers/lib/jobQueue/background-jobs-manager.js";
import {
  CalcET0Worker,
  FuncemeFTPDataMinerWorker,
} from "../../src/workers/handlers/index.js";

// node

async function register() {
  console.log(process.env);
  const today = new Date()
  await BackgroundJobsManager.connectToQueue();

  await BackgroundJobsManager.startQueueMonitoring();

  await BackgroundJobsManager.registerAllWorkers(workers);

  await BackgroundJobsManager.createJob(
    FuncemeFTPDataMinerWorker.name_queue,
    { date: null },
    {
      // singletonKey: "1",
      useSingletonQueue: true,
      // startAfter: today,
      retryLimit: 3,
      retryDelay: 15,
    }
  );

  await BackgroundJobsManager.createJob(
    CalcET0Worker.name_queue,
    { date: null },
    {
      singletonKey: "2",
      useSingletonQueue: true,
      // startAfter: new Date(today).setHours(23, 8, 0),
      retryLimit: 3,
      retryDelay: 15,
    }
  );
}

register();
