import Client from "ftp";
import { ftpConfig } from "../../../../../../../config/ftp.js";

export class FTPClientAdapter {
  connection;

  static instance = null;

  constructor() {
    this.connection = new Client();
  }

  async close() {
    return new Promise((resolve, reject) => {
      console.log("FTP ::: Closing connection...");
      this.connection.end();

      this.connection.once("close", (err) => {
        if (err)
          return reject(new Error(`Falha ao fechar a conexão ::: ${err}`));
        console.log("[FTP] Conexão com ftp fechada com sucesso");
        resolve();
      });
    });
  }

  async status() {
    return new Promise((resolve, reject) => {
      this.connection.status((err, status) => {
        if (err) return reject(err);

        resolve(status);
      });
    });
  }

  async connect() {
    console.log("Iniciando conexão com o servidor FTP da funceme");
    return new Promise((resolve, reject) => {
      console.log("FTP ::: Conectando a ", ftpConfig());
      this.connection.connect(ftpConfig());

      // this.connection.once("close", (err) => {
      //   if (err)
      //     return reject(new Error(`Falha ao fechar a conexão ::: ${err}`));
      //   console.log("[FTP] Conexão com ftp fechada com sucesso");
      // });

      this.connection.once("error", (err) => {
        return reject(
          new Error(`Falha ao realizar conexão com ftp ::: ${err.message}`)
        );
      });

      this.connection.on("greeting", (msg) => console.log("[Greeting] ", msg));

      this.connection.on("end", () =>
        console.log("[FTP] Conexão FTP fechada...")
      );

      this.connection.on("ready", () => {
        resolve(true);
      });
    });
  }

  async getFile(folder, file) {
    console.log(`[FTP] 🔍 Getting stream from path ${folder}/${file}`);
    return new Promise((resolve, reject) => {
      this.connection.cwd("/", (error) => {
        if (error) reject(error);
      });

      this.connection.cwd(folder, (error, current) => {
        if (error) {
          console.log(error);
          return reject(error);
        }
      });

      this.connection.status((error, status) => {
        if (error) {
          console.log(error);
        }

        console.log(status);
      });

      // this.connection.cwd("/", (error) => {
      //   if (error) {
      //     console.log(error);
      //     return reject(error);
      //   }
      // });

      this.connection.get(file, function (error, stream) {
        console.log("[FTP] Baixando arquivo");
        if (error) {
          console.log(error);
          return reject(error);
        }
        console.log("[FTP] Success to get file");
        resolve(stream);
      });
    });
  }
}
