export class FuncemeDataMinerDTO {
  date;

  constructor(payload) {
    const separator = "-";
    let month = payload.getMonth() + 1;
    let day = payload.getDate();
    if (month < 10) month = `0${month}`;
    if (day < 10) day = `0${day}`;

    this.date = `${payload.getFullYear()}${separator}${month}${separator}${day}`;
  }

  getDate() {
    return this.date;
  }
}
