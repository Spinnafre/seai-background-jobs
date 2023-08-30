export class FuncemeDataMinerDTO {
  date;

  constructor(payload) {
    const separator = "-";
    const date = new Date(payload);
    let month = date.getMonth() + 1;
    let day = date.getDate();
    if (month < 10) month = `0${month}`;
    if (day < 10) day = `0${day}`;

    this.date = `${date.getFullYear()}${separator}${month}${separator}${day}`;
  }

  getDate() {
    return this.date;
  }
}
