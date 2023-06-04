class DTO {
  date;

  constructor(payload) {
    this.date = payload;
  }

  getDate() {
    throw new Error("Not implemented");
  }
}

export class InmetDataMinerDTO extends DTO {
  constructor(date) {
    super(date);
  }

  getDate() {
    // dd-mm-yyyy
    return this.date.split("/").join("-");
  }
}

export class FuncemeDataMinerDTO extends DTO {
  constructor(date) {
    super(date);
  }

  // dd/mm/yyyy
  getDate() {
    return this.date;
  }
}
