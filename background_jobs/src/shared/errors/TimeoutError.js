export class TimeoutError extends Error {
  constructor(time, stack) {
    super(`Tempo de ${time} milisegundos excedido.`);
    this.stack = stack;
    this.name = "TimeoutError";
  }
}
