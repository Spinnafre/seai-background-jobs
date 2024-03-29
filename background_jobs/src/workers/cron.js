import { FuncemeFTPWorker } from "./handlers/index.js";

export const cronJobs = [
  {
    queue: FuncemeFTPWorker.name_queue,
    cron: "0 0 * * *",
    data: null,
    options: {
      tz: "America/Fortaleza",
      retryLimit: 3,
      retryDelay: 60,
      priority: 2,
    },
  },
  // {
  //   queue: CalcET0Worker.name_queue,
  //   cron: "10 0 * * *",
  //   data: null,
  //   options: {
  //     tz: "America/Fortaleza",
  //     retryLimit: 3,
  //     retryDelay: 15,
  //     priority: 1,
  //   },
  // },
];
