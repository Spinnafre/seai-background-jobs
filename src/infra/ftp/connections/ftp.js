import * as dotenv from "dotenv";

dotenv.config();

import Client from "ftp";

import zlib from "zlib";
import tar from "tar-stream";
import { StationReadings } from "./readingsOfStationsFromFunceme.js";

import { Writable, Transform, Readable } from "stream";
import { pipeline } from "stream/promises";

import { formatDateToYYMMDD, getYesterday } from "../../../utils/date.js";

// extract.once("finish", () => {
//   console.log("Finalizado o processo de extração de dados das estações");
//   if (stationsCodes.some((station_code) => station_code === STATION_CODE)) {
//     console.log(
//       `Não foi possível obter dados da estação ${STATION_CODE}, por favor verifique se a estação existe.`
//     );
//   }
//   connection.end();
// });
class FTPClientAdapter {
  connection;
  constructor() {
    this.connection = new Client();
  }

  close() {
    console.log("Closing connection...");
    this.connection.end();
  }

  connect() {
    this.connection.connect({
      host: process.env.FTP_FUNCEME_HOST,
      user: process.env.FTP_FUNCEME_USER,
      password: process.env.FTP_FUNCEME_PASSWORD,
      keepalive: 10000,
      pasvTimeout: 10000,
      connTimeout: 10000,
    });

    this.connection.once("close", (err) => {
      if (err) throw new Error(err);
      console.log("Conexão com ftp fechada com sucesso");
    });

    this.connection.once("error", (err) => {
      console.log("Falha ao realizar conexão com ftp da funceme.\n", err);
      this.close();
    });

    this.connection.on("greeting", (msg) => console.log("Greeting ", msg));

    this.connection.on("end", () => console.log("FTP connection ended..."));
  }

  async getFolderStream(directory, file) {
    console.log(`[🔍] Getting stream from path ${directory}/${file}`);
    return new Promise((resolve, reject) => {
      this.connect();

      this.connection.on("ready", () => {
        this.connection.cwd(directory, (error) => {
          if (error) reject(error);
        });
        this.connection.get(file, function (error, stream) {
          if (error) reject(error);

          resolve(stream);
        });
      });
    });
  }

  async unTar(tarballStream) {
    const results = {}; // [fileName] : Buffer
    return new Promise((resolve, reject) => {
      const extract = tar.extract();

      extract.on("entry", async function (header, stream, next) {
        const chunks = [];
        // Semelhante ao stream.on('data',()=>{})
        for await (let chunk of stream) {
          chunks.push(chunk);
        }
        //Transforma array de buffers em um único buffer
        results[header.name] = Buffer.concat(chunks);
        next();
      });

      extract.on("finish", function () {
        resolve(results);
      });
      tarballStream.pipe(zlib.createUnzip()).pipe(extract);
    });
  }

  convertCsvToJson() {
    return new Transform({
      objectMode: true,
      transform(chunk, enc, next) {
        const data = chunk.toString();
        if (!data) return next(new Error("File is empty"));
        const station = StationReadings.create(data);
        next(null, station);
      },
    });
  }

  filterByStationCode(codes=[]) {
    return new Transform({
      objectMode: true,
      transform(chunk, enc, next) {
        const station = chunk;

        if (codes.includes(station.props.code)) {
          return next(null, station);
        }

        next();
      },
    });
  }

  logStation() {
    return new Writable({
      objectMode: true,
      write(chunk, enc, next) {
        if (!chunk) {
          return next();
        }

        const station = chunk;
        console.log("Escrevendo...", station.props.measures.length);

        // stations.push({
        //   code: station.props.code,
        //   name: station.props.name,
        //   fileName,
        // });
        console.log(
          "[✅] - Sucesso ao obter dados da estação: ",
          station.props
        );

        next();
      },
    });
  }

  async getYesterdayStationByCode() {
    const date = formatDateToYYMMDD(getYesterday());
    //Ver uma forma de automatizar
    const stationFolder = "pcds";
    const file = "stn_data_2023.tar.gz";

    // const DATE = "2023-04-18";

    // TODO: Buscar códigos das estações da FUNCEME
    const STATIONS_CODES = ["A305","B8505818"]

    const stream = await this.getFolderStream(stationFolder, file);

    stream.once("close", function () {
      // connection.end();
      console.log(
        `Sucesso ao obter dados do diretório ${stationFolder}/${file}`
      );
    });

    console.log(
      `Iniciando extração de dados do diretório ${stationFolder}/${file}`
    );
    // stream.pipe(zlib.createUnzip()).pipe(extract);

    // [fileName] : Buffer
    const streamsOfFiles = await this.unTar(stream);

    // Closing ftp connection
    this.close();

    for (const [fileName, buffer] of Object.entries(streamsOfFiles)) {
      console.log(`Lendo arquivo ${fileName}`);

      const readable = Readable.from(buffer);

      try {
        await pipeline(
          readable,
          this.convertCsvToJson(),
          this.filterByStationCode(STATIONS_CODES),
          this.logStation()
        );
      } catch (error) {
        console.log(
          `Falha ao converter dados do arquivo ${fileName}.\n ${error}`
        );
      }
    }
  }

  getPluviometers() {}
}

const ftp = new FTPClientAdapter();
await ftp.getYesterdayStationByCode();
