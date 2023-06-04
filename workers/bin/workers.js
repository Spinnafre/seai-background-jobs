import * as worker from "../src/workers/run.js";

import dotenv from "dotenv";

import { resolve } from "node:path";

dotenv.config({
  path: resolve(".env"),
});

worker.run();

process.on("uncaughtException", (error) => {
  console.error(`[WORKERS] - Erro na execução. ${error}`);
  process.exit(1);
});
