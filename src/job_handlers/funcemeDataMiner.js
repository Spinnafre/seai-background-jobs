import { FuncemeDataMinerHandler } from "../modules/scrapper/handlers/funceme.js";

export async function run(job) {
  const handler = new FuncemeDataMinerHandler();

  await handler.run(job);
}

const today = new Date();
const tomorrow = new Date(today);
tomorrow.setDate(tomorrow.getDate() - 1);
const date = Number((tomorrow.valueOf() / 1000).toPrecision(10));
console.log(date);

await run(date);
