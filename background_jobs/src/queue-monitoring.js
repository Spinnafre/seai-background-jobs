import { QueueManager } from "./lib/jobQueue/background-jobs-manager.js";

import "dotenv/config.js";

console.log(process.env);

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

await QueueManager.connect();

await QueueManager.start();

await QueueManager.processAllWorkers();

process.on("uncaughtException", (error) => {
  console.error(`[WORKERS] - Erro na execução. ${error}`);
  process.exit(1);
});
