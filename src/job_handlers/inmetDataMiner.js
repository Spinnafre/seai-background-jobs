import { InmetDataMinerHandler } from "../modules/scrapper/handlers/inmet.js";

async function run(payload) {
  console.log(payload);
  const handler = new InmetDataMinerHandler();

  await handler.run(payload);
}

export default run;
