import { FuncemeScrapper } from "../../src/workers/handlers.js";

import dotenv from "dotenv";

import { resolve } from "node:path";

dotenv.config({
  path: resolve("..", "..", ".env"),
});

async function run() {
  console.log(process.env);
  const handler = new FuncemeScrapper();

  await handler.handler({ id: 0, data: { date: "05/06/2023" } });
}

run();
