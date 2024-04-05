import {
  FetchFuncemeEquipmentsWorker,
  FetchFuncemeMeasurementsWorker,
} from "./handlers/funceme/index.js";

export const cronJobs = [
  {
    queue: FetchFuncemeEquipmentsWorker.name_queue,
    cron: "0 0 * * *",
    data: null,
    options: {
      tz: "America/Fortaleza",
      retryLimit: 3,
      retryDelay: 60,
      priority: 1,
    },
  },
  {
    queue: FetchFuncemeMeasurementsWorker.name_queue,
    cron: "0 1 * * *",
    data: null,
    options: {
      tz: "America/Fortaleza",
      retryLimit: 3,
      retryDelay: 60,
      priority: 2,
    },
  },
];
