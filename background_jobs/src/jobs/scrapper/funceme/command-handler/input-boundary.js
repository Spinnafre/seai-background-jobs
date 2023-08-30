export class FuncemeDataMinerDTO {
  date;

  constructor(payload) {
    this.date = payload;
  }

  // dd/mm/yyyy
  getDate() {
    const separator = "-";
    let month = this.date.getMonth() + 1;
    let day = this.date.getDate();
    if (month < 10) month = `0${month}`;
    if (day < 10) day = `0${day}`;
    return `${this.date.getFullYear()}${separator}${month}${separator}${day}`;
  }
}
