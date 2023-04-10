import {Result} from './Result.js'

export class Validator {
  
  static combine (guardResults= []) {
    throw new Error("Not implemented")
  }

  static greaterThan (minValue, actualValue) {
    throw new Error("Not implemented")
  }

  static againstNullOrUndefined (argument, argumentName) {
    if (argument === null || argument === undefined) {
      return {
        status:
        message:`${argumentName} is null or undefined`
      }
    } else {
      return Result.success();
    }
  }

  static againstNullOrUndefinedBulk(args=[]) {
    for (let arg of args) {
      const result = this.againstNullOrUndefined(arg.argument, arg.argumentName);
      if (result.isFailure) return result;
    }

    return Result.ok<GuardResponse>();
  }


  static inRange (num, min, max, argumentName)  {
    const isInRange = num >= min && num <= max;
    if (!isInRange) {
      return Result.fail<GuardResponse>(`${argumentName} is not within range ${min} to ${max}.`);
    } else {
      return Result.ok<GuardResponse>()
    }
  }

  static allInRange (numbers=[], min, max, argumentName) {
    let failingResult = null;

    for(let num of numbers) {
      const numIsInRangeResult = this.inRange(num, min, max, argumentName);
      if (!numIsInRangeResult.isFailure) failingResult = numIsInRangeResult;
    }


  }
}