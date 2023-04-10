export class Result {
  static status = ["SUCCESS", "ERROR", "WARNING", "PENDING"];

  #message = "";

  #operation = "";
  #status = "ERROR";
  #date = 0;

  constructor(status, operation, message = "") {
    this.#status = status;
    this.#operation = operation;
    this.#message = message;
    this.#date = Date.now();
  }

  get message() {
    if (this.#status === "SUCCESS") {
      throw new Error(
        "Can't get the value of an message result. Use 'message' instead."
      );
    }
    return this.#message;
  }

  get status() {
    return this.#status;
  }

  get operation() {
    return this.#operation;
  }

  get date() {
    return this.#date;
  }

  static success(operation) {
    if (!operation) {
      throw new Error(
        "InvalidOperation: A success result needs to contain an operation name."
      );
    }

    return new Result("SUCCESS", operation);
  }

  static error(operation, error) {
    if (!operation && !error) {
      throw new Error(
        "InvalidOperation: A failing result needs to contain an error message and operation name."
      );
    }

    return new Result("ERROR", operation, error);
  }

  static warning(operation, message) {
    if (!operation && !message) {
      throw new Error(
        "InvalidOperation: A warning result needs to contain an message and operation name."
      );
    }

    return new Result("WARNING", operation, message);
  }
}
