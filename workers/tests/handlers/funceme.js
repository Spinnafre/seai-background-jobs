import dotenv from "dotenv";

import { resolve } from "node:path";
import { FuncemeScrapperCommand } from "../../src/workers/Scrapper/funceme/cli/commands/funceme-scrapper-command.js";

dotenv.config({
  path: resolve(".env"),
});

async function run() {
  console.log(process.env);
  const handler = new FuncemeScrapperCommand(
    stationDataMinerFactory(),
    pluviometerDataMinerFactory(),
    FtpClientAdapter,
    buildFuncemeDataMinerLogs()
  )();

  await handler.handler({ id: 0, data: { date: "18/07/2023" } });
}

run();
