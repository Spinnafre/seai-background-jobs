import { Logger } from "../../../shared/logger.js";
import { Left, Right } from "../../../shared/result.js";
import { convertCompressedFileStream } from "../external/adapters/unzip/untar-adapter.js";

export class FetchFTPData {
  constructor(ftpClient) {
    this.ftpConnection = ftpClient;
  }

  async serialize(data) {
    try {
      const serializedData = await convertCompressedFileStream(data);

      // console.log(`serialize = ${serializedData}`);

      if (serializedData.length) {
        return Right.create(serializedData);
      }
    } catch (error) {
      Logger.error({
        msg: "Falha ao realizar serialização de dados provindos do FTP.",
        obj: error,
      });

      return Left.create(error);
    }
  }

  async getDataFromDirectory({ folder, fileName }) {
    Logger.info(
      `Iniciando extração de dados do diretório ${folder}/${fileName}`
    );

    const compressedFileStream = await this.ftpConnection.getFile(
      folder,
      fileName
    );

    const data = await this.serialize(compressedFileStream);

    return data;
  }
}
