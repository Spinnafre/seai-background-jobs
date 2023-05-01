import {
  formatDateToYYMMDD,
  getYesterday,
  StationParser,
  RainGaugeParser,
  convertCompressedFileStream,
} from "../../../utils/index.js";

import { FuncemeMap } from "../../../core/mappers/funceme/funcemeMap.js";

class FuncemeGateway {
  ftpConnection;

  station = {
    folder: "pcds",
    fileName: "stn_data_2023.tar.gz",
  };

  rainGauge = {
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

    compressedFileStream.once("close", function () {
      console.log(`Sucesso ao obter dados do diretório ${folder}/${file}`);
    });

    console.log(`Iniciando extração de dados do diretório ${folder}/${file}`);

    data = await convertCompressedFileStream(compressedFileStream);

    return data;
  }

  async getYesterdayStationsByCodes(codes = []) {
    const date = formatDateToYYMMDD(getYesterday());

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

  async getYesterdayRainGaugesByCodes(codes = []) {
    const date = formatDateToYYMMDD(getYesterday());

    const rawList = await this.extractCsvFromFile(
      this.rainGauge.folder,
      this.rainGauge.fileName
    );

    if (!rawList) {
      return null;
    }

    const parsedData = await RainGaugeParser.parse(rawList);

    const rainGauges = [];

    for (const data of parsedData) {
      const rainGauge = FuncemeMap.rainGaugeToDomain(data);

      if (
        codes.includes(rainGauge.code) &&
        rainGauge.filterMeasuresByDate(date)
      ) {
        rainGauges.push(rainGauge);
      }
    }

    return rainGauges;
  }
}

export { FuncemeGateway };
