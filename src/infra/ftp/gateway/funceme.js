import { FuncemeMap } from "../../../core/mappers/funceme/funcemeMap.js";

import { RainGaugeCsvParser, StationCsvParser } from "../../../utils/csvParser.js";

import { convertCompressedFileStreamToStrings } from "../../../utils/untar.js";

import {
  filterDataByCodes,
  filterMeasuresByDate,
} from "./helpers.js";

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
    let data = []

    const compressedFile = await this.ftpConnection.getFile(folder, file);

    compressedFile.once("close", function () {
      console.log(`Sucesso ao obter dados do diretório ${folder}/${file}`);
    });

    console.log(`Iniciando extração de dados do diretório ${folder}/${file}`)

    data = await convertCompressedFileStreamToStrings(compressedFile);

    return data;
  }

  async getStationData(folder, file) {

    const result = filterDataByCodes(codes, parsedData);
    return result;
  }
  async parseCSVData(parser) {
    return await parser.parse()
  }
  async getYesterdayStationDataByCodes(codes = [], date = null) {
    const rawList = await this.extractCsvFromFile(this.station.folder,
      this.station.fileName);


    if (rawList) {
      const parsedData = await this.parseCSVData(new StationCsvParser(rawList))

      const filteredData = filterMeasuresByDate(date, filterDataByCodes(codes, parsedData))

      const mappedData = filteredData.map((raw) => FuncemeMap.stationToDomain(raw));

      return mappedData;
    }

    return null;
  }

  async getYesterdayRainGaugeDataByCodes(codes = [], date = null) {
    
    const rawList = await this.extractCsvFromFile(this.rainGauge.folder,
      this.rainGauge.fileName);


    if (rawList) {
      const parsedData = await this.parseCSVData(new RainGaugeCsvParser(rawList))

      const filteredData = filterMeasuresByDate(date, filterDataByCodes(codes, parsedData))

      const mappedData = filteredData.map((raw) => FuncemeMap.stationToDomain(raw));

      return mappedData;
    }

    return null;
  }
}

export { FuncemeGateway };
