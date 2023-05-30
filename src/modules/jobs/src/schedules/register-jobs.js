import { PGBoss } from "../data/pgBoss.js";

async function run() {
  try {
    const pg = await PGBoss.create();

    await pg.init();

    const InmetQueue = "inmet-queue";
    const FuncemeQueue = "funceme-queue";

    const today = new Date();
    const yesterday = new Date(today);

    yesterday.setDate(yesterday.getDate() - 1);
    today.setHours(23, 0, 0);
    console.log(today.getTime(), ":::", yesterday.getTime());

    const date = Intl.DateTimeFormat("pt-BR").format(yesterday);

    // await pg.publish(
    //   InmetQueue,
    //   { date },
    //   {
    //     singletonKey: "1",
    //     useSingletonQueue: true,
    //     // startAfter: today,
    //     retryLimit: 4,
    //     retryDelay: 5,
    //   }
    // );

    await pg.publish(
      FuncemeQueue,
      { date },
      {
        singletonKey: "2",
        useSingletonQueue: true,
        // startAfter: today,
        retryLimit: 1,
        retryCount: 3,
        retryDelay: 5,
      }
    );

    process.exit(0);
  } catch (error) {
    console.error("Error to connecting to PgBOSS: ", error);
    return;
  }
}

run();
