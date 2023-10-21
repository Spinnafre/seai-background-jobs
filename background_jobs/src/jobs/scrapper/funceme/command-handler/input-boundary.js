export class FuncemeDataMinerDTO {
  date;
  #hour;

  constructor(payload) {
    const separator = "-";
    const date = new Date(payload);
    let month = date.getMonth() + 1;
    let day = date.getDate();
    if (month < 10) month = `0${month}`;
    if (day < 10) day = `0${day}`;

    this.date = `${date.getFullYear()}${separator}${month}${separator}${day}`;
    this.#hour = date.getHours();
  }

  // yyyy-mm-dd
  getDate() {
    return this.date;
  }

  getHour() {
    return this.#hour;
  }
}
