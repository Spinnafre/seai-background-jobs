import { makeCalcEtoWorkerHandler } from "./factories/handlers/calc-eto.js";
import { makeFetchFuncemeMeasuresHandler } from "./factories/handlers/fetch-funceme-measures.js";
import { CalcET0Worker, FuncemeFTPDataMinerWorker } from "./handlers/index.js";

export default [
  {
    queue_name: FuncemeFTPDataMinerWorker.name_queue,
    workers: [
      {
        name: FuncemeFTPDataMinerWorker.worker_name,
        process: (command) => {
          return makeFetchFuncemeMeasuresHandler().handler(command);
        },
      },
    ],
  },
  {
    queue_name: CalcET0Worker.name_queue,
    workers: [
      {
        name: CalcET0Worker.worker_name,
        process: (command) => {
          return makeCalcEtoWorkerHandler().handler(command);
        },
      },
    ],
  },
];
