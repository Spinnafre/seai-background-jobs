import * as dotenv from "dotenv";

dotenv.config();

import { createWriteStream } from "fs";
import Client from "ftp";

import zlib from "zlib";
import tar from "tar-stream";
import { StationReadings } from "./readingsOfStationsFromFunceme.js";

import { Writable, Transform, Readable } from "stream";
import { createReadStream } from "fs";

const connection = new Client();

let dirs = [];

const DATE = "2023-04-18";
const STATION_CODE = "B8505818";
const PLIVIOMETER_CODE = "";

const extract = tar.extract();

const stationsCodes = [];

connection.connect({
  host: process.env.FTP_FUNCEME_HOST,
  user: process.env.FTP_FUNCEME_USER,
  password: process.env.FTP_FUNCEME_PASSWORD,
  keepalive: 10000,
  pasvTimeout: 10000,
  connTimeout: 10000,
});

extract.on("entry", function (header, stream, cb) {
  const stations = [];
  const selectedStation = "";

  const writable = new Writable({
    objectMode: true,
    write(chunk, enc, next) {
      if (!chunk) {
        return next(null);
      }
      const { station, fileName } = chunk;

      console.log("Escrevendo...", station.props.measures.length);

      stations.push({
        code: station.props.code,
        name: station.props.name,
        fileName,
      });

      if (station.props.code === STATION_CODE) {
        console.log(
          "[✅] - Sucesso ao obter dados da estação: ",
          station.props
        );
      }

      next(null);
    },
  });

  let buffer = null;
  let receivedItems = 0;

  const transform = new Transform({
    objectMode: true,
    transform(chunk, enc, next) {
      const data = chunk.toString();

      if (!data) return next(null, null);

      const fileName = header.name;

      console.log(`Formatando dados do arquivo ${fileName}`);

      const station = StationReadings.create(data);

      next(null, { station, fileName });
    },
  });

  // evento emitido quando todos os pedaços da stream são recuperados
  stream.on("data", (chunk) => {
    receivedItems++;
    buffer += chunk;
    console.log(`Recebido ${receivedItems} pacote(s)`);
  });

  // Emitido após todos os chunks da stream serem processados
  stream.on("end", () => {
    const readable = Readable.from(buffer);

    readable
      .pipe(transform)
      .pipe(writable)
      .on("finish", () => {
        console.log(
          "Sucesso ao buscar dados de estação, iniciando leitura de próximo arquivo"
        );
        cb();
      });
  });

  stream.resume();
});

extract.once("finish", () => {
  console.log("Finalizado o processo de extração de dados das estações");
  if (stationsCodes.some((station_code) => station_code === STATION_CODE)) {
    console.log(
      `Não foi possível obter dados da estação ${STATION_CODE}, por favor verifique se a estação existe.`
    );
  }
  connection.end();
});

// /pcds
connection.on("ready", function () {
  console.log("Buscando dados das estações...");

  connection.cwd("pcds", (error) => {
    if (error) throw error;
  });

  console.log("[🔍] - Lendo dados de 2023...");

  connection.get("stn_data_2023.tar.gz", (error, stream) => {
    if (error) throw new Error(error);

    stream.once("close", function () {
      // connection.end();
      console.log("Sucesso ao obter dados das estações da FUNCEME.");
    });

    console.log("Iniciando extração de dados das estações");
    stream.pipe(zlib.createUnzip()).pipe(extract);
    // .pipe(createWriteStream("test.tar"));
  });
});

// const stream = createReadStream(
//   "../../../../data/mock/funceme/pcds/stn_data_2023.tar.gz"
// );
// stream.pipe(zlib.createUnzip()).pipe(extract);

connection.once("close", (err) => {
  if (err) throw new Error(err);
  console.log("Conexão com ftp fechada com sucesso");
});

connection.once("error", (err) => {
  console.log("Falha ao realizar conexão com ftp da funceme.\n", err);
  connection.end();
});
