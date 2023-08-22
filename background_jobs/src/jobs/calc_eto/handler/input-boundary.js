export class CalcEtoDTO {
  date;

  constructor(payload) {
    this.date = payload;
  }

  getDay() {}

  getYear() {}

  // dd/mm/yyyy
  getDate() {
    return this.date;
  }
}
