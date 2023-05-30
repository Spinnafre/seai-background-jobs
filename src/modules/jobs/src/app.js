import { PGBoss } from "./data/pgBoss.js";

import { FuncemeHandler } from "../../scrapper/presentation/handlers/funceme.js";
import { InmetHandler } from "../../scrapper/presentation/handlers/inmet.js";

async function start() {
  try {
    const pg = await PGBoss.create();

    await pg.init();

    const InmetQueue = "inmet-queue";
    const FuncemeQueue = "funceme-queue";

    await pg.subscribe(FuncemeQueue, FuncemeHandler);
  } catch (error) {
    console.error("Error to connecting to PgBOSS: ", error);
    return;
  }
}

start();
