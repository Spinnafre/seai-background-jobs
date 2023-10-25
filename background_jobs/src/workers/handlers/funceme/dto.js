import { DateFormatter } from "../../../shared/date-formatter.js";
import { DailyWorkerDTO } from "../../../shared/workers/handlerDTO.js";

export class FuncemeScrapperWorkerDTO extends DailyWorkerDTO {
  constructor(payload) {
    super(payload);
  }

  getDateToQuery() {
    const yesterDayDate = DateFormatter.getPreviousDate(new Date(), 1);
    return yesterDayDate;
  }

  getDay() {
    return DateFormatter.padTo2Digits(this.getDateToQuery().getDate());
  }

  getYear() {
    return this.getDateToQuery().getFullYear();
  }

  getDate() {
    return DateFormatter.formatByDateSeparator(this.getDateToQuery(), {
      separator: "-",
    });
  }
}
