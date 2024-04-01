import {
  makeFetchFuncemeEquipmentsHandler,
  makeFetchFuncemeMeasurementsHandler,
  makeSendAccountNotificationHandler,
  makeSendNewsletterHandler,
} from "./factories/handlers/index.js";
import {
  FetchFuncemeMeasurementsWorker,
  FuncemeFuncemeEquipmentsWorker,
  SendNewsletterWorker,
  SendUserAccountNotificationWorker,
} from "./handlers/index.js";

export default [
  {
    queue_name: FuncemeFuncemeEquipmentsWorker.name_queue,
    workers: [
      {
        name: FuncemeFuncemeEquipmentsWorker.worker_name,
        process: (command) =>
          makeFetchFuncemeEquipmentsHandler().handler(command),
      },
    ],
  },
  {
    queue_name: FetchFuncemeMeasurementsWorker.name_queue,
    workers: [
      {
        name: FetchFuncemeMeasurementsWorker.worker_name,
        process: (command) =>
          makeFetchFuncemeMeasurementsHandler().handler(command),
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
