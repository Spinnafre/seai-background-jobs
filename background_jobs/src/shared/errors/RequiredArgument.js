export class RequiredArgument extends Error {
  constructor(argumentName) {
    super(`The argument "${argumentName}" is required.`);
    this.name = "RequiredArgument";
  }
}
