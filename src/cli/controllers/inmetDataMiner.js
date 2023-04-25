class InmetDataMinerController {
  #service;

  constructor(service) {
    this.#service = service;
  }

  async execute(params) {
    const date = new Date();
    try {
      console.log(
        `[${date}] - Iniciando extração de dados das estações do Inmet `
      );

      await this.#service.execute(params);
    } catch (error) {
      // Registrar nos logs
      console.error(`[${date}] - ERROR - InmetDataMinerController \n`, error);
    }
  }
}

export { InmetDataMinerController };
