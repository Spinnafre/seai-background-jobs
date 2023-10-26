import { makeCalcEtoWorkerHandler } from "../../../src/workers/factories/handlers/calc-eto.js";

const handler = makeCalcEtoWorkerHandler();

try {
  await handler.handler();

  process.exit();
} catch (error) {
  console.error(error);
  process.exit(1);
}
