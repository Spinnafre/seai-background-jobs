import Client from "ftp";
import { unTar } from "../../../utils/untar.js";

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

  async #getFileStream(folder, file) {
    console.log(`[🔍] Getting stream from path ${folder}/${file}`);
    return new Promise((resolve, reject) => {
      this.connect();

      this.connection.on("ready", () => {
        this.connection.cwd(folder, (error) => {
          if (error) reject(error);
        });
        this.connection.get(file, function (error, stream) {
          if (error) reject(error);

          resolve(stream);
        });
      });
    });
  }

  async getUntarFiles(folder, file) {
    const stream = await this.#getFileStream(folder, file);

    stream.once("close", function () {
      // connection.end();
      console.log(`Sucesso ao obter dados do diretório ${folder}/${file}`);
    });

    console.log(`Iniciando extração de dados do diretório ${folder}/${file}`);

    // [fileName] : Buffer
    const streamsOfFiles = await unTar(stream);

    this.close();

    return streamsOfFiles;
  }
}

export { FTPClientAdapter };
