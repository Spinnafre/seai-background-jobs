import Client from "ftp";

import dotenv from "dotenv";

import path from "node:path";
dotenv.config({
  path: path.resolve("..", "..", "inmetscrapper", ".env"),
});

class FTPClientAdapter {
  connection;

  static instance = null;
  #isAlreadyConnected = false;

  static create() {
    if (!FTPClientAdapter.instance) {
      console.log("CRIANDO CONEXÃO");
      FTPClientAdapter.instance = new FTPClientAdapter();
    }
    return FTPClientAdapter.instance;
  }

  constructor() {
    this.connection = new Client();
  }

  async close() {
    return new Promise((resolve) => {
      console.log("Closing connection...");
      this.connection.end();
      this.#isAlreadyConnected = false;
      resolve();
    });
  }

  isAlreadyConnected() {
    return this.#isAlreadyConnected;
  }

  async status() {
    return new Promise((resolve, reject) => {
      this.connection.status((err, status) => {
        if (err) reject(err);

        resolve(status);
      });
    });
  }

  async connect() {
    // console.log(process.env);
    return new Promise((resolve, reject) => {
      this.connection.connect({
        host: process.env.FTP_FUNCEME_HOST,
        user: process.env.FTP_FUNCEME_USER,
        password: process.env.FTP_FUNCEME_PASSWORD,
        keepalive: 10000,
        pasvTimeout: 10000,
        connTimeout: 10000,
      });

      this.connection.once("close", (err) => {
        if (err)
          resolve({
            connected: false,
            message: err,
          });
        console.log("Conexão com ftp fechada com sucesso");
      });

      this.connection.once("error", (err) => {
        resolve({
          connected: false,
          message: `Falha ao realizar conexão com ftp da funceme. ${err}`,
        });
        this.close();
      });

      this.connection.on("greeting", (msg) => console.log("Greeting ", msg));

      this.connection.on("end", () => console.log("FTP connection ended..."));

      this.connection.on("ready", () => {
        this.#isAlreadyConnected = true;
        resolve({
          connected: true,
        });
      });
    });
  }

  async getFile(folder, file) {
    console.log(`[🔍] Getting stream from path ${folder}/${file}`);
    return new Promise((resolve, reject) => {
      this.connection.cwd("/", (error) => {
        if (error) reject(error);
      });
      this.connection.cwd(folder, (error) => {
        if (error) reject(error);
      });
      this.connection.get(file, function (error, stream) {
        if (error) reject(error);

        resolve(stream);
      });
    });
  }
}

export { FTPClientAdapter };
