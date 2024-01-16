import { Left } from "./result.js";

export class Validator {
  static validateBulk(params) {
    for (const argument of params) {
      if (Reflect.has(argument.data, "to")) {
        // return Left.create(new R());
      }
    }
  }
}
