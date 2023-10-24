import { FuncemeFTPDataMinerWorker, CalcET0Worker } from "./handlers/index.js";

export const cronJobs = [
  {
    queue: FuncemeFTPDataMinerWorker,
    cron: "* * * * *",
    data: null,
    options: {
      tz: "America/Fortaleza",
      retryLimit: 3,
      retryDelay: 15,
    },
  },
  {
    queue: CalcET0Worker.name_queue,
    cron: "*/2 * * * *",
    data: null,
    options: {
      tz: "America/Fortaleza",
      retryLimit: 3,
      retryDelay: 15,
    },
  },
];
