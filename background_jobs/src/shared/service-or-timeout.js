import { TimeoutError } from "./errors/TimeoutError.js";

export function timeout(timer) {
  return new Promise((_, reject) => {
    setTimeout(reject, timer, new TimeoutError(timer));
  });
}
