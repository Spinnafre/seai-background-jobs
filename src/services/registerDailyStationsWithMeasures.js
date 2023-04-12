import { Result } from "../utils/Result.js";

import { setTimeout } from "node:timers/promises";

import scrapperConfig from "../config/scrapper.js";
import { formatDate } from "../utils/date.js";
class RegisterDailyStationsWithMeasures {
  #getStationsFromInmetService;
  #getStationsFromFuncemeService;
  #stationRepository;

  #attemptsResults = [];
  #currentAttempt = 0;

  constructor(getStationsFromInmetService, stationRepository) {
    this.#getStationsFromInmetService = getStationsFromInmetService;
    this.#stationRepository = stationRepository;
  }

  async execute(params) {
    let inmetStations = [];

    do {
      if (this.#attemptsResults.length) {
        process.nextTick(() =>
          console.log(
            `⏲️ Tetando novamente em ${
              scrapperConfig.timeToAttemptAgain / 1000
            } segundos`
          )
        );
        await setTimeout(scrapperConfig.timeToAttemptAgain);
      }

      const inmetStationsOrError =
        await this.#getStationsFromInmetService.execute(params);

      if (inmetStationsOrError.isFailure) {
        this.#attemptsResults.push(Result.error(inmetStationsOrError.error));
        this.#currentAttempt++;
      } else {
        inmetStations = inmetStationsOrError.value;
        break;
      }
    } while (
      this.#attemptsResults.some((result) => result.isFailure === true) &&
      this.#currentAttempt < scrapperConfig.maxAttempts
    );

    console.log("Tentativas: ", this.#currentAttempt);

    console.log(
      "Erros: ",
      this.#attemptsResults.map(
        (tempt) =>
          formatDate(
            tempt.time,
            {
              day: "numeric",
              month: "numeric",
              year: "numeric",
            },
            "pt-BR"
          ) +
          " : " +
          tempt.error
      )
    );

    console.log(inmetStations);
  }
}

export { RegisterDailyStationsWithMeasures };
