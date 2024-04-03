// Pass to FetchFunceme Service
import { DateFormatter } from "../../shared/date-formatter.js";

export class FetchEquipmentCommand {
  #currentDate;
  constructor(isoString) {
    this.#currentDate = isoString ? new Date(isoString) : new Date();
  }

  getYesterdayDate() {
    const yesterDayDate = DateFormatter.getPreviousDate(this.#currentDate, 1);
    return yesterDayDate;
  }

  getDate() {
    return DateFormatter.formatByDateSeparator(this.getYesterdayDate(), {
      separator: "-",
    });
  }
}
