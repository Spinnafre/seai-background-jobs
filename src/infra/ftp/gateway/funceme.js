import { pipeline } from "stream/promises";

import { FuncemeMap } from "../../../core/mappers/funceme/funcemeMap.js";

import { unTar } from "../../../utils/untar.js";
import { filterDataByCodes, parseCsvStream } from "./helpers.js";
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

  async getUncompressedFiles(folder, file) {
    const fileStream = await this.ftpConnection.getFile(folder, file);

    fileStream.once("close", function () {
      console.log(`Sucesso ao obter dados do diretório ${folder}/${file}`);
    });

    console.log(`Iniciando extração de dados do diretório ${folder}/${file}`);

    const filesStream = await unTar(fileStream);

    return filesStream;
  }

  getDataByCodes(folder, file) {
    return async (codes = []) => {
      const stream = await this.getUncompressedFiles(folder, file);

      const parsedData = await parseCsvStream(stream);
      const result = filterDataByCodes(codes, parsedData);
      return result;
    };
  }

  async getStationDataByCodes(codes = []) {
    const rawData = await this.getDataByCodes(
      this.station.folder,
      this.station.fileName
    )(codes);

    if (rawData) {
      const stations = rawData.map((raw) => FuncemeMap.stationToDomain(raw));
      return stations;
    }

    return null;
  }

  async getRainGaugeDataByCodes(codes = []) {
    const rawData = await this.getDataByCodes(
      this.rainGauge.folder,
      this.rainGauge.fileName
    )(codes);

    if (rawData) {
      const stations = rawData.map((raw) => FuncemeMap.rainGaugeToDomain(raw));
      return stations;
    }

    return null;
  }
}

export { FuncemeGateway };
