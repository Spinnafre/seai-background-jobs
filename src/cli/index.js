class DataMiner {
  #inmetService;
  #funcemeService;

  constructor(inmetService, funcemeService) {
    this.#inmetService = inmetService;
    this.#funcemeService = funcemeService;
  }

  async execute() {
    const date = new Date();

    try {
      console.log(
        `[${date}] - Iniciando extração de dados das estações do Inmet`
      );

      //await this.#inmetService.execute();

      console.log(
        `[${date}] - Iniciando extração de dados das estações da Funceme`
      );
      await this.#funcemeService.execute();
    } catch (error) {
      // Registrar nos logs
      console.error(
        `[${date}] - ERROR - RegisterDailyStationsController \n`,
        error
      );
    }
  }
}

export { DataMiner };
