import "dotenv/config.js";

import { makeFetchFuncemeMeasuresHandler } from "../../../src/workers/factories/handlers/fetch-funceme-measures.js";

const funcemeScrapperCommand = makeFetchFuncemeMeasuresHandler();

try {
  await funcemeScrapperCommand.handler();

  process.exit();
} catch (error) {
  console.error(error);
  process.exit(1);
}
