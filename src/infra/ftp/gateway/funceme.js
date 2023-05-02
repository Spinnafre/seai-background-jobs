import {
  formatDateToYYMMDD,
  getYesterday,
  StationParser,
  PluviometerParser,
  convertCompressedFileStream,
} from "../../../utils/index.js";

import { FuncemeMap } from "../../../core/mappers/funceme/funcemeMap.js";

class FuncemeGateway {
  ftpConnection;

  station = {
    folder: "pcds",
    fileName: "stn_data_2023.tar.gz",
  };

  pluviometer = {
    folder: "pluviometros",
    fileName: "prec_data_2023.tar.gz",
  };

  constructor(ftpClient) {
    this.ftpConnection = ftpClient;
  }

  async connect() {
    await this.ftpConnection.connect();
  }

  async close() {
    await this.ftpConnection.close();
  }

  async checkStatus() {
    return await this.ftpConnection.status();
  }

  async extractCsvFromFile(folder, file) {
    let data = [];

    const compressedFileStream = await this.ftpConnection.getFile(folder, file);

    console.log(`Iniciando extração de dados do diretório ${folder}/${file}`);

    data = await convertCompressedFileStream(compressedFileStream);

    return data;
  }

  async getStationsByCodesAndDate(codes = [], date) {
    const rawList = await this.extractCsvFromFile(
      this.station.folder,
      this.station.fileName
    );

    if (!rawList) {
      return null;
    }

    const parsedData = await StationParser.parse(rawList);
    const stations = [];

    for (const data of parsedData) {
      const station = FuncemeMap.stationToDomain(data);

      if (codes.includes(station.code) && station.filterMeasuresByDate(date)) {
        stations.push(station);
      }
    }

    return stations;
  }

  async getPluviometersByCodesAndDate(codes = [], date) {
    const rawList = await this.extractCsvFromFile(
      this.pluviometer.folder,
      this.pluviometer.fileName
    );

    if (!rawList) {
      return null;
    }

    const parsedData = await PluviometerParser.parse(rawList);

    const pluviometers = [];

    for (const data of parsedData) {
      const pluviometer = FuncemeMap.pluviometerToDomain(data);

      if (
        codes.includes(pluviometer.code) &&
        pluviometer.filterMeasuresByDate(date)
      ) {
        pluviometers.push(pluviometer);
      }
    }

    return pluviometers;
  }
}

export { FuncemeGateway };
