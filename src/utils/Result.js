export class Result {
  static status = ["SUCCESS", "ERROR", "WARNING", "PENDING"];

  #message = "";

  #operation = null;
  #status = "ERROR";

  constructor({ status = "", message = "", operation = null }) {
    this.#status = status;
    this.#operation = operation;
    this.#message = message;
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

  get isSuccess() {
    return ["SUCCESS", "WARNING"].includes(this.#status);
  }

  get isFailure() {
    return this.#status === "ERROR";
  }

  static success(operation = null) {
    return new Result({
      status: "SUCCESS",
      operation,
    });
  }

  static error({ error, operation = null }) {
    if (!error) {
      throw new Error(
        "InvalidOperation: A failing result needs to contain an error message"
      );
    }

    return new Result({
      status: "ERROR",
      message: error,
      operation,
    });
  }

  static warning({ message, operation = null }) {
    if (!message) {
      throw new Error(
        "InvalidOperation: A warning result needs to contain an message and operation name."
      );
    }

    return new Result({
      status: "WARNING",
      message,
      operation,
    });
  }
}
