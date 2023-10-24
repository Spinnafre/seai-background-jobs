export class ConnectionError extends Error {
  constructor(msg) {
    super(`Falha ao conectar ao FTP da funceme. Error: ${msg}`);
    this.name = "ConnectionError";
  }
}
