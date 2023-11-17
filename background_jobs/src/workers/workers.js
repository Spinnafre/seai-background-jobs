import { makeFetchFuncemeMeasuresHandler } from "./factories/handlers/fetch-funceme-measures.js";
import { FuncemeFTPWorker } from "./handlers/index.js";

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
  // {
  //   queue_name: CalcET0Worker.name_queue,
  //   workers: [
  //     {
  //       name: CalcET0Worker.worker_name,
  //       process: (command) => makeCalcEtoWorkerHandler().handler(command),
  //     },
  //   ],
  // },
];
