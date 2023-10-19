import { CalcET0Handler } from "../jobs/calc_eto/handler/handler";
import { FuncemeScrapperCommand } from "../jobs/scrapper/funceme/command-handler/funceme-scrapper-command";

export const cronJobs = [
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
