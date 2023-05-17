import { InmetDataMinerHandler } from "../modules/scrapper/handlers/inmet";

export async function run(payload) {
  const handler = new InmetDataMinerHandler();

  await handler.run(payload);
}
