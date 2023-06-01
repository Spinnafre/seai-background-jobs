import * as worker from "../src/workers/run.js";

worker.run();

process.on("uncaughtException", (error) => {
  console.error(`[WORKERS] - Erro na execução. ${error}`);
  process.exit(1);
});
