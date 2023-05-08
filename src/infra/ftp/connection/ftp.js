import Client from "ftp";
class FTPClientAdapter {
  connection;
  constructor() {
    this.connection = new Client();
  }

  async close() {
    return new Promise((resolve) => {
      console.log("Closing connection...");
      this.connection.end();
      resolve();
    });
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
        if (err) reject(err);
        console.log("Conexão com ftp fechada com sucesso");
      });

      this.connection.once("error", (err) => {
        reject("Falha ao realizar conexão com ftp da funceme.\n", err);
        this.close();
      });

      this.connection.on("greeting", (msg) => console.log("Greeting ", msg));

      this.connection.on("end", () => console.log("FTP connection ended..."));

      this.connection.on("ready", () => {
        resolve(true);
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
