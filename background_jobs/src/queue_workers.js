import { FuncemeScrapperCommandFactory } from "./jobs/scrapper/funceme/factories/command-handler/funceme-scrapper-command-factory.js";
import { MailerFactory } from "./jobs/mailer/factories/send-notification-factory.js";
import { DailyScheduleFactory } from "./jobs/scheduler/factories/scheduler-command-handler-factory.js";
import { FuncemeScrapperCommand } from "./jobs/scrapper/funceme/command-handler/funceme-scrapper-command.js";
import { SendNotification } from "./jobs/mailer/command-handler/send-notification.js";
import { DailyScheduler } from "./jobs/scheduler/command-handler/scheduler.js";
import { CalcET0Handler } from "./jobs/calc_eto/handler/handler.js";
import { CalcEtoHandlerFactory } from "./jobs/calc_eto/factories/handler/calc-eto-handler-factory.js";

export default [
  {
    queue_name: FuncemeScrapperCommand.name_queue,
    workers: [
      {
        name: "funceme_scrapper",
        process: (command) => {
          const funcemeScrapper = FuncemeScrapperCommandFactory();
          return funcemeScrapper.handler(command);
        },
      },
    ],
  },
  {
    queue_name: CalcET0Handler.name_queue,
    workers: [
      {
        name: "calc_eto",
        process: (command) => {
          const calcEtoHandler = CalcEtoHandlerFactory();
          return calcEtoHandler.handler(command);
        },
      },
    ],
  },
  {
    queue_name: SendNotification.name_queue,
    workers: [
      {
        name: "mailer",
        process: (command) => {
          const mailer = MailerFactory();
          return mailer.handler(command);
        },
      },
    ],
  },
  {
    queue_name: DailyScheduler.name_queue,
    workers: [
      {
        name: "daily_scheduler",
        process: (command) => {
          const dailyScheduler = DailyScheduleFactory();
          return dailyScheduler.handler(command);
        },
      },
    ],
  },
];
