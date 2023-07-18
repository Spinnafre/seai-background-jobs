import { QueueManager } from "../../lib/jobQueue/manager.js";

import { FuncemeScrapper } from "../Scrapper/handlers/funceme.js";

export class DailyScheduler {
  static name_queue = "daily-scheduler";

  async handler(payload) {
    // data que será agendado o worker para buscar dados
    const current_date = new Date();

    // data que será passada para o worker realizar a busca
    // na fonte de dados
    const yesterday = new Date(current_date).setDate(
      current_date.getDate() - 1
    );

    current_date.setHours(23, 0, 0);

    console.log(current_date.getTime(), ":::", yesterday);

    //DD/MM/YYYY
    const date = Intl.DateTimeFormat("pt-BR").format(yesterday);

    // Agenda todos os dias para executar a busca de dados da
    // funceme no período do dia de execução do worker.
    await QueueManager.createJob(
      FuncemeScrapper.name_queue,
      { date },
      {
        singletonKey: "1",
        useSingletonQueue: true,
        startAfter: current_date,
        retryLimit: 3,
        retryDelay: 15,
      }
    );
  }
}
