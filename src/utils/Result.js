export class Result {
  static status = ["SUCCESS", "ERROR", "WARNING", "PENDING"];

  #message = "";

  #value = "";

  #status = "ERROR";

  constructor({ status = "", message = "", value = null }) {
    this.#status = status;
    this.#value = value;
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

  get value() {
    if (this.#status === "ERROR") {
      throw new Error("Can't get the value of an result.");
    }
    return this.#value;
  }

  get status() {
    return this.#status;
  }

  get isSuccess() {
    return ["SUCCESS", "WARNING"].includes(this.#status);
  }

  get isFailure() {
    return this.#status === "ERROR";
  }

  static success(value) {
    return new Result({
      status: "SUCCESS",
      value,
    });
  }

  static error({ error, value }) {
    if (!error) {
      throw new Error(
        "InvalidOperation: A failing result needs to contain an error message"
      );
    }

    return new Result({
      status: "ERROR",
      message: error,
      value,
    });
  }

  static warning({ message, value }) {
    if (!message) {
      throw new Error(
        "InvalidOperation: A warning result needs to contain an message and operation name."
      );
    }

    return new Result({
      status: "WARNING",
      message,
      value,
    });
  }
}
