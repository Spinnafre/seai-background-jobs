import { QueueManager } from "../../lib/jobQueue/manager.js";

import { FuncemeScrapper } from "../Scrapper/handlers/funceme.js";

export class DailyScheduler {
  static name_queue = "daily-scheduler";
  async handler(payload) {
    const today = new Date();
    const yesterday = new Date(today);

    yesterday.setDate(yesterday.getDate() - 1);
    today.setHours(23, 0, 0);
    console.log(today.getTime(), ":::", yesterday.getTime());

    const date = Intl.DateTimeFormat("pt-BR").format(yesterday);

    await QueueManager.createJob(
      FuncemeScrapper.name_queue,
      { date },
      {
        singletonKey: "1",
        useSingletonQueue: true,
        // startAfter: today,
        retryLimit: 3,
        retryDelay: 15,
      }
    );

    // await QueueManager.createJob(
    //   InmetScrapper.name_queue,
    //   { date },
    //   {
    //     singletonKey: "2",
    //     useSingletonQueue: true,
    //     startAfter: today,
    //     retryLimit: 1,
    //     retryDelay: 15,
    //   }
    // );
  }
}
