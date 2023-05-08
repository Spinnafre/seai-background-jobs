import { FormatDate } from "../utils/index.js";

export class CreateReadTime {
  #ReadTimeDao;

  constructor(ReadTimeDao) {
    this.#ReadTimeDao = ReadTimeDao;
  }
  async execute() {
    const yesterdayDate = FormatDate.getYesterdayTimestamp();

    let date = await this.#ReadTimeDao.getLastDate();

    // Evitar salvar dados no banco com datas repetidas
    if (
      !date ||
      FormatDate.timestampToDate(date.timestamp) !==
        FormatDate.timestampToDate(yesterdayDate)
    ) {
      const id = await this.#ReadTimeDao.create(yesterdayDate);

      date = {
        id: id,
        timestamp: yesterdayDate,
      };
    }
    return date;
  }
}
