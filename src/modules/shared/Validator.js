// import { Result } from "./Result.js";

// export class Validator {
//   static checkIfEmpty(arg) {
//     if (typeof arg == "string") {
//       const value = arg.trim();
//       return value === "";
//     }
//     const value = arg.length;
//     return !!value === false;
//   }
//   static againstNullOrUndefined(argument, argumentName) {
//     if (
//       argument === null ||
//       argument === undefined ||
//       Validator.checkIfEmpty(argument)
//     ) {
//       return Result.error(`[ERROR] : ${argumentName} is null or undefined`);
//     } else {
//       return Result.success();
//     }
//   }

//   static againstNullOrUndefinedBulk(args = []) {
//     for (const arg of args) {
//       const result = this.againstNullOrUndefined(
//         arg.argument,
//         arg.argumentName
//       );
//       if (result.isFailure) return result;
//     }

//     return Result.success();
//   }

//   static isOneOf({ argument, argumentName }, validValues = []) {
//     const isValid = validValues.includes(argument);

//     if (isValid) {
//       return Result.success();
//     }

//     return Result.error(
//       `${argumentName} isn't oneOf the correct types in ${JSON.stringify(
//         validValues
//       )}. Got "${argument}".`
//     );
//   }

//   static checkIfRawArrayHasValidValues(args = [], validValues = []) {
//     for (const arg of args) {
//       const result = validValues.includes(arg);
//       if (!result)
//         return Result.error(
//           `[ERROR] : ${arg} is not included in ${JSON.stringify(validValues)}`
//         );
//     }

//     return Result.success();
//   }
// }
