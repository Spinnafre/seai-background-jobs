export class CalcEtoDTO {
  date;

  constructor(payload) {
    this.date = payload;
  }

  getDay() {
    return new Date(this.date).getDate();
  }

  getYear() {
    return new Date(this.date).getFullYear();
  }

  getMonth() {
    return new Date(this.date).getMonth() + 1;
  }

  // dd/mm/yyyy
  getDate() {
    return Intl.DateTimeFormat("pt-BR").format(new Date(this.date));
  }
}
