import { Result } from "../utils/Result.js";

import { setTimeout } from "node:timers/promises";

import scrapperConfig from "../config/scrapper.js";
import { formatDateToForwardSlash } from "../utils/date.js";
class InmetDataMiner {
  #attemptsResults = [];
  #currentAttempt = 0;

  constructor(inmetScrapper, metereologicalEquipmentDao, stationReadDao) {
    this.inmetScrapper = inmetScrapper;
    this.metereologicalEquipmentDao = metereologicalEquipmentDao;
    this.stationReadDao = stationReadDao;
  }

  async execute(date = { IdTime: null, Time: "" }) {
    const stationsEquipments =
      await this.metereologicalEquipmentDao.getInmetEquipmentByType("station");

    if (!stationsEquipments.length) {
      console.log("Não há estações do INMET cadastradas");

      return;
    }

    const STATIONS_CODES = stationsEquipments.map(
      (station) => station.IdEquipmentExternal
    );

    let inmetStations = [];

    const formatedDate = formatDateToForwardSlash(date.Time);

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

      let stations = [];

      if (inmetStations.length) {
        for (const station of inmetStations) {
          if (
            STATIONS_CODES.includes(station.code) &&
            station.date === formatedDate
          ) {
            const equipment = stationsEquipments.find(
              (equipment) => equipment.IdEquipmentExternal === station.code
            );

            if (!!equipment === true) {
              const { temperature, windSpeed, humidity } = station;

              stations.push({
                IdEquipment: equipment.IdEquipment,
                IdOrgan: equipment.Organ.FK_Organ,
                IdTime: date.IdTime,
                measures: {
                  temperature,
                  windSpeed,
                  humidity,
                },
              });
            }
          }
        }
      } else {
        stations = stationsEquipments.map((equipment) => {
          return {
            IdEquipment: equipment.IdEquipment,
            IdOrgan: equipment.Organ.FK_Organ,
            IdTime: date.IdTime,
            measures: {},
          };
        });
      }

      await this.stationReadDao.create(stations);
    } catch (error) {
      // append to error logs
    }
  }

  async getStations() {
    const scrapper = await this.inmetScrapper.build({
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

      console.log(stationsWithMeasures);

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

export { InmetDataMiner };
