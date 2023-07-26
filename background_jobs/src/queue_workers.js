import { FuncemeScrapperCommandFactory } from "./jobs/scrapper/funceme/factories/command-handler/funceme-scrapper-command-factory.js";
import { MailerFactory } from "./jobs/mailer/factories/send-notification-factory.js";
import { DailyScheduleFactory } from "./jobs/scheduler/factories/scheduler-command-handler-factory.js";

const funcemeScrapper = FuncemeScrapperCommandFactory();

const mailer = MailerFactory();
const dailyScheduler = DailyScheduleFactory();

export default [
  {
    queue_name: funcemeScrapper.name_queue,
    workers: [
      {
        name: funcemeScrapper.constructor.name,
        process: (command) => funcemeScrapper.handler(command),
      },
    ],
  },
  {
    queue_name: mailer.name_queue,
    workers: [
      {
        name: mailer.constructor.name,
        process: (command) => mailer.handler(command),
      },
    ],
  },
  {
    queue_name: dailyScheduler.name_queue,
    workers: [
      {
        name: dailyScheduler.constructor.name,
        process: (command) => dailyScheduler.handler(command),
      },
    ],
  },
];
