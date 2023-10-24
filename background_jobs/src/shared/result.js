// Either Monad

export class Right {
  __result = "SUCCESS";
  data = null;

  constructor(data) {
    this.data = data;
  }

  isError() {
    return false;
  }

  isSuccess() {
    return true;
  }

  value() {
    return this.data;
  }

  static create(data) {
    return new Ok(data);
  }
}

export class Left {
  __result = "ERROR";
  err = null;

  constructor(data) {
    this.err = data;
  }

  isError() {
    return true;
  }

  isSuccess() {
    return false;
  }

  error() {
    return this.err;
  }

  static create(data) {
    return new Err(data);
  }
}
