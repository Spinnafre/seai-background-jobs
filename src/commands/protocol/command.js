export class Command {
  #params;

  constructor() {
    this.#params = null;
  }

  setParams(params) {
    if (this.#params === null) {
      this.#params = params;
    }
    return;
  }

  getParams() {
    if (this.#params === null) {
      throw new Error("Não existe parâmetros definidos para o comando.");
    }
    return this.#params;
  }

  async execute() {
    throw new Error("Command method not implemented");
  }
}
