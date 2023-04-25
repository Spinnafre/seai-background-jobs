import { Writable, Transform, Readable } from "stream";
import { pipeline } from "stream/promises";

import { FuncemeMap } from "../../../core/mappers/funceme/funcemeMap.js";

class FuncemeGateway {
  ftpConnection;

  #station = {
    folder: "pcds",
    file: "stn_data_2023.tar.gz",
  };

  #rainGauges = {
    folder: "pluviometros",
    file: "prec_data_2023.tar.gz",
  };

  constructor(ftpClient) {
    this.ftpConnection = ftpClient;
  }

  async getStationsByCodes(codes = []) {
    const stations = [];

    const streams = await this.ftpConnection.getUntarFiles(
      this.#station.folder,
      this.#station.file
    );

    for (const [fileName, buffer] of Object.entries(streams)) {
      // console.log(`Lendo arquivo ${fileName}`);

      const readable = Readable.from(buffer);

      try {
        await pipeline(
          readable,
          this.#mapCsvToDomain(FuncemeMap.stationStringToDomain),
          this.#filterByCodes(codes),
          this.#concatenateData(stations)
        );
      } catch (error) {
        console.error(
          `Falha ao converter dados do arquivo ${fileName}.\n ${error}`
        );
      }
    }
    return stations;
  }

  async getRainGaugesByCodes(codes = []) {
    const rainGauges = [];

    const streams = await this.ftpConnection.getUntarFiles(
      this.#rainGauges.folder,
      this.#rainGauges.file
    );

    for (const [fileName, buffer] of Object.entries(streams)) {
      // console.log(`Lendo arquivo ${fileName}`);

      const readable = Readable.from(buffer);

      try {
        await pipeline(
          readable,
          this.#mapCsvToDomain(FuncemeMap.rainGaugeStringToDomain),
          this.#filterByCodes(codes),
          this.#concatenateData(rainGauges)
        );
      } catch (error) {
        console.error(
          `Falha ao converter dados do arquivo ${fileName}.\n ${error}`
        );
      }
    }

    return rainGauges;
  }

  #mapCsvToDomain(mapper) {
    return new Transform({
      objectMode: true,
      transform(chunk, enc, next) {
        const string = chunk.toString();
        if (!string) return next(new Error("File is empty"));
        const station = mapper(string);
        next(null, station);
      },
    });
  }

  #filterByCodes(codes = []) {
    return new Transform({
      objectMode: true,
      transform(chunk, enc, next) {
        const data = chunk;

        if (codes.includes(data.code)) {
          return next(null, data);
        }

        next();
      },
    });
  }

  #concatenateData(array = []) {
    return new Writable({
      objectMode: true,
      write(chunk, enc, next) {
        if (!chunk) {
          return next();
        }

        const data = chunk;

        console.log("[✅] - Sucesso ao obter dados de: ", data.name);

        array.push(data);

        next();
      },
    });
  }
}

export { FuncemeGateway };
