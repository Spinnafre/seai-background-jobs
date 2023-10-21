export class CalcEtoDTO {
  date;

  constructor(payload) {
    this.date = payload;
  }

  getDay() {
    let day = new Date(this.date).getDate();
    if (day < 10) day = `0${day}`;
    return day;
  }

  getYear() {
    return new Date(this.date).getFullYear();
  }

  getMonth() {
    let month = new Date(this.date).getMonth() + 1;
    if (month < 10) month = `0${month}`;
    return month;
  }

  getHour() {
    return new Date(this.date).getHours();
  }

  // dd/mm/yyyy
  getDate() {
    const separator = "-";
    return `${this.getYear()}${separator}${this.getMonth()}${separator}${this.getDay()}`;
    // return Intl.DateTimeFormat("pt-BR").format(new Date(this.date));
  }
}
