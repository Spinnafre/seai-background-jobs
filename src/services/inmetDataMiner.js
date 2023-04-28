import { Result } from "../utils/Result.js";

import { setTimeout } from "node:timers/promises";

import scrapperConfig from "../config/scrapper.js";
import { formatDate } from "../utils/date.js";
class InmetDataMinerService {
  #stationRepository;
  #inmetScrapper;

  #attemptsResults = [];
  #currentAttempt = 0;

  constructor(stationRepository, inmetScrapper) {
    this.#stationRepository = stationRepository;
    this.#inmetScrapper = inmetScrapper;
  }

  async execute() {
    let inmetStations = [];

    try {
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

        const inmetStationsOrError = await this.getStations();

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

      if (inmetStations.length) {
        const CODES = ["A305"];

        console.log(
          inmetStations.filter((station) => {
            return CODES.includes(station.date);
          })
        );
      }
    } catch (error) {
      // append to error logs
    }
  }

  async getStations() {
    const scrapper = await this.#inmetScrapper.build({
      ...scrapperConfig.page,
      ...scrapperConfig.launchConfig,
    });

    try {
      const result = scrapper.setParams(scrapperConfig.params);

      if (result.isFailure) {
        return Result.error(result.error);
      }

      const timeoutPromise = new Promise((resolve, reject) => {
        setTimeout(
          () =>
            reject(
              new Error(
                `Exceeded the tolerance time limit ${scrapperConfig.toleranceTime}`
              )
            ),
          scrapperConfig.toleranceTime
        );
      });

      const stationsWithMeasures = await Promise.race([
        scrapper.getStationsWithMeasures(),
        timeoutPromise,
      ]);

      if (stationsWithMeasures.length) {
        console.log(
          "[✅] Sucesso ao obter dados concatenados de estações com medições"
        );
        return Result.success(stationsWithMeasures);
      }

      console.log("[⚠️] Não há dados de estações com medições especificadas");
      return Result.error(
        "Error in get stations with meditions from Inmet: No station data."
      );
    } catch (error) {
      await scrapper.closeBrowser();
      return Result.error(error.message);
    }
  }
}

export { InmetDataMinerService };
