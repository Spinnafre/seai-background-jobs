export class FuncemeDataMinerDTO {
  date;

  constructor(payload) {
    this.date = payload;
  }

  // dd/mm/yyyy
  getDate() {
    return Intl.DateTimeFormat("pt-BR").format(this.date);
  }
}
