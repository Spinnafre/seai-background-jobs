"use strict";

class RegisterDailyStationsController {
  #service;

  constructor(service) {
    this.#service = service;
  }

  async execute(params) {
    const date = new Date();
    try {
      console.log(
        `[${date}] - Iniciando extração de dados das estações do Inmet e Funcreme`
      );

      await this.#service.execute(params);
    } catch (error) {
      // Registrar nos logs
      console.log(
        `[${date}] - ERROR - RegisterDailyStationsController \n`,
        error
      );
    }
  }
}

export { RegisterDailyStationsController };
