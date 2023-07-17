import { convertCompressedFileStream } from "../../external/adapters/unzip/untar-adapter.js";

export class FetchFuncemeData {
  constructor(
    ftpClient,
    parser,
    mapper,
    directory = {
      folder: "",
      fileName: "",
    }
  ) {
    this.ftpConnection = ftpClient;

    this.parser = parser;

    this.mapper = mapper;

    this.directory = directory;
  }

  async #extractData() {
    // TODO: Avaliar se é possível deixar a conexão nessa função
    // await this.ftpConnection.connect();

    const compressedFileStream = await this.ftpConnection.getFile(
      this.directory.folder,
      this.directory.fileName
    );

    console.log(
      `Iniciando extração de dados do diretório ${this.directory.folder}/${this.directory.fileName}`
    );

    const data = await convertCompressedFileStream(compressedFileStream);

    // await this.ftpConnection.close();

    return data;
  }

  async fetch(codes, date) {
    const rawList = await this.#extractData();

    const parsedData = await this.parser.parse(rawList);

    const data = [];

    parsedData.forEach((pluviometer) => {
      if (codes.includes(pluviometer.code)) {
        const { code, name, measures } = pluviometer;
        console.log("Measure Data = ", measure.data, " filter date = ", date);
        const measure = measures.find((measure) => measure.data == date);

        if (measure) {
          data.push({
            code,
            ...this.mapper.mapMeasures(measure),
          });
        }
      }
    });

    return data;
  }
}
