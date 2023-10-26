import { DateFormatter } from "../../../shared/date-formatter.js";
import { DailyWorkerDTO } from "../../../shared/workers/handlerDTO.js";

export class CalcEtoWorkerDTO extends DailyWorkerDTO {
  constructor(payload) {
    super(payload);
  }

  getDateToQuery() {
    const yesterDayDate = DateFormatter.getPreviousDate(new Date(), 1);
    return yesterDayDate;
  }

  getDate() {
    return DateFormatter.formatByDateSeparator(this.getDateToQuery(), {
      separator: "-",
    });
  }
}
