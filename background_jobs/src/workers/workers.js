import {
  makeSendAccountNotificationHandler,
  makeSendNewsletterHandler,
} from "./factories/handlers/index.js";

import {
  FetchFuncemeEquipmentsWorker,
  FetchFuncemeMeasurementsWorker,
  SendNewsletterWorker,
  SendUserAccountNotificationWorker,
} from "./handlers/index.js";

export default [
  {
    queue_name: FetchFuncemeEquipmentsWorker.name_queue,
    workers: [
      {
        name: FetchFuncemeEquipmentsWorker.worker_name,
        process: (command) => FetchFuncemeEquipmentsWorker.handler(command),
      },
    ],
  },
  {
    queue_name: FetchFuncemeMeasurementsWorker.name_queue,
    workers: [
      {
        name: FetchFuncemeMeasurementsWorker.worker_name,
        process: (command) => FetchFuncemeMeasurementsWorker.handler(command),
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
