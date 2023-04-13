import scrapperConfig from "../../config/scrapper.js";
import { Result } from "../../utils/Result.js";

class ExtractStationsFromInmet {
  #inmetScrapper;

  constructor(inmetScrapper) {
    this.#inmetScrapper = inmetScrapper;
  }

  #sleep(time, value) {
    return new Promise((resolve, reject) => {
      setTimeout(() => reject(new Error(value)), time);
    });
  }

  async execute(params, toleranceTime = scrapperConfig.toleranceTime) {
    const scrapper = await this.#inmetScrapper.build({
      ...scrapperConfig.page,
      ...scrapperConfig.launchConfig,
    });

    try {
      const result = scrapper.setParams(params);

      if (result.isFailure) {
        return Result.error(result.error);
      }

      const timeoutPromise = this.#sleep(
        toleranceTime,
        `Exceeded the tolerance time limit ${toleranceTime}`
      );

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
      console.log("[ERROR] - ", error.message);
      await scrapper.closeBrowser();
      return Result.error(error.message);
    }
  }
}

export { ExtractStationsFromInmet };
