import * as dotenv from "dotenv";

dotenv.config();

import { createWriteStream } from "fs";
import Client from "ftp";

import zlib from "zlib";
import tar from "tar-stream";
import { StationReadings } from "./readingsOfStationsFromFunceme.js";

const connection = new Client();

let dirs = [];

const DATE = "2023-02-05";
const STATION_CODE = "A305";
const PLIVIOMETER_CODE = "";

const extract = tar.extract();

const stationsCodes = [];

connection.connect({
  host: process.env.FTP_FUNCEME_HOST,
  user: process.env.FTP_FUNCEME_USER,
  password: process.env.FTP_FUNCEME_PASSWORD,
  keepalive: 15000,
  pasvTimeout: 15000,
});

extract.on("entry", function (header, stream, cb) {
  let data = "";

  console.log("Lendo dados das estações do arquivo ", header.name);

  stream.on("data", function (chunk) {
    data = chunk.toString();

    const station = StationReadings.create(data);
    console.log(station.props);
    if (station.props.code === STATION_CODE) {
      console.log(
        "[✅] - Sucesso ao obter dados da estação: ",
        station.getStationMeasuresByDate(DATE)
      );
    } else {
      stationsCodes.push(station.props.code);
    }
  });

  stream.on("end", function () {
    cb();
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

  console.log("Baixando dados de 2023...");

  connection.get("stn_data_2023.tar.gz", (error, stream) => {
    if (error) throw new Error(error);

    stream.once("close", function () {
      // connection.end();
      console.log("Sucesso ao obter dados das estações da FUNCEME.");
    });

    console.log("Iniciando extração de dados das estações");
    stream.pipe(zlib.createUnzip()).pipe(extract);
  });
});

connection.once("close", (err) => {
  if (err) throw new Error(err);
  console.log("Conexão com ftp fechada com sucesso");
});
