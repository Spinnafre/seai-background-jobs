import { FuncemeDataMinerHandler } from "../modules/scrapper/handlers/funceme.js";

export async function run(job) {
  const handler = new FuncemeDataMinerHandler();

  await handler.run(job);
}
