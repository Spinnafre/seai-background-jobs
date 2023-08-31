import { CalcEtoHandlerFactory } from "./jobs/calc_eto/factories/handler/calc-eto-handler-factory.js";
import { CalcET0Handler } from "./jobs/calc_eto/handler/handler.js";
import { FuncemeScrapperCommand } from "./jobs/scrapper/funceme/command-handler/funceme-scrapper-command.js";
import { FuncemeScrapperCommandFactory } from "./jobs/scrapper/funceme/factories/command-handler/funceme-scrapper-command-factory.js";

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
  // {
  //   queue_name: SendNotification.name_queue,
  //   workers: [
  //     {
  //       name: "mailer",
  //       process: (command) => {
  //         const mailer = MailerFactory();
  //         return mailer.handler(command);
  //       },
  //     },
  //   ],
  // }
];
