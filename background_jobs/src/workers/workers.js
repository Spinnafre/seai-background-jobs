import {
  makeCalcEtoWorkerHandler,
  makeFetchFuncemeMeasuresHandler,
  makeSendNewsletterHandler,
  makeSendAccountNotificationHandler,
} from "./factories/handlers/index.js";
import {
  FuncemeFTPWorker,
  SendNewsletterWorker,
  CalcET0Worker,
  SendUserAccountNotificationWorker,
} from "./handlers/index.js";

export default [
  {
    queue_name: FuncemeFTPWorker.name_queue,
    workers: [
      {
        name: FuncemeFTPWorker.worker_name,
        process: (command) =>
          makeFetchFuncemeMeasuresHandler().handler(command),
      },
    ],
  },
  {
    queue_name: CalcET0Worker.name_queue,
    workers: [
      {
        name: CalcET0Worker.worker_name,
        process: (command) => makeCalcEtoWorkerHandler().handler(command),
      },
    ],
  },
  {
    queue_name: SendNewsletterWorker.name_queue,
    workers: [
      {
        name: SendNewsletterWorker.worker_name,
        process: (command) => makeSendNewsletterHandler().handler(command),
      },
    ],
  },
  {
    queue_name: SendUserAccountNotificationWorker.name_queue,
    workers: [
      {
        name: SendUserAccountNotificationWorker.worker_name,
        process: (command) =>
          makeSendAccountNotificationHandler().handler(command),
      },
    ],
  },
];
