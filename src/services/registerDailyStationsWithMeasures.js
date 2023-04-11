import { Result } from "../utils/Result.js";

class RegisterDailyStationsWithMeasures {
  #getStationsFromInmetService;
  #getStationsFromFuncemeService;
  #stationRepository;

  constructor(getStationsFromInmetService, stationRepository) {
    this.#getStationsFromInmetService = getStationsFromInmetService;
    this.#stationRepository = stationRepository;
  }

  async execute(params) {
    const inmetStationsOrError =
      await this.#getStationsFromInmetService.execute(params);

    if (inmetStationsOrError.isFailure) {
      // Tentar executar de novo
      return Result.error(inmetStationsOrError.error);
    }

    const inmetStations = inmetStationsOrError.value;

    console.log(inmetStations);
  }
}

export { RegisterDailyStationsWithMeasures };
