class FuncemeDataMinerController {
  #service;

  constructor(service) {
    this.#service = service;
  }

  async execute() {
    const date = new Date();
    try {
      console.log(
        `[${date}] - Iniciando extração de dados das estações da Funceme`
      );

      await this.#service.execute();
    } catch (error) {
      // Registrar nos logs
      console.error(
        `[${date}] - ERROR - RegisterDailyStationsController \n`,
        error
      );
    }
  }
}

export { FuncemeDataMinerController };
