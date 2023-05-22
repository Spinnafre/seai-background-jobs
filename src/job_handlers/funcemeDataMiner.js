import * as dotenv from 'dotenv'

import { FuncemeDataMinerHandler } from "../modules/scrapper/handlers/funceme.js";

dotenv.config()

export async function run(job) {
  const handler = new FuncemeDataMinerHandler();

  await handler.run(job);
}
