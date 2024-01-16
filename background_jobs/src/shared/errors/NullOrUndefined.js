export class NullOrUndefinedError extends Error {
  constructor(argumentName) {
    super(`The argument "${argumentName}" is null or undefined.`);
    this.name = "NullOrUndefinedError";
  }
}
