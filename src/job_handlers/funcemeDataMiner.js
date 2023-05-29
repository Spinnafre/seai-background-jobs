import { FuncemeDataMinerHandler } from "../modules/scrapper/handlers/funceme.js";

async function run(job) {
  console.log(`[FUNCEME] ::: job ${job.id}`);
  console.log(job.data);
  const handler = new FuncemeDataMinerHandler();

  await handler.run(job.data);
}
export default run;
