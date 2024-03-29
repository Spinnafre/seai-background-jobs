// Fetch Funceme Equipments Service with last Measurements

import { Logger } from "../../../../shared/logger.js";
import { Left, Right } from "../../../../shared/result.js";
import { PluviometerMapper, StationMapper } from "../../core/mappers/index.js";
import { FUNCEME_FTP_DIRECTORIES } from "../config/funceme-ftp-directories.js";
import { EquipmentParser } from "../parser/index.js";
import { convertCompressedFileStream } from "../external/adapters/unzip/untar-adapter.js";

export class FetchFuncemeEquipments {
  #ftpAdapter;
  #metereologicalOrganRepository;

  constructor(ftpClientAdapter, metereologicalOrganRepository) {
    this.#ftpAdapter = ftpClientAdapter;
    this.#metereologicalOrganRepository = metereologicalOrganRepository;
    // this.#logger = logger;
  }

  async getLastUpdatedFileName(folder) {
    const currentYear = new Date().getFullYear();

    const filesDescriptionsFromFolder =
      await this.#ftpAdapter.getFolderContentDescription(folder);

    if (filesDescriptionsFromFolder.length === 0) {
      return null;
    }

    const fileDescription = filesDescriptionsFromFolder.filter((file) => {
      return file.name.includes(currentYear);
    });

    if (fileDescription.length === 0) {
      return null;
    }

    const { name } = fileDescription[0];

    return name;
  }

  async getFiles(folder) {
    const fileName = await this.getLastUpdatedFileName(folder);

    if (!fileName) {
      return null;
    }

    const compressedStreamOfFiles = await this.#ftpAdapter.getFile(
      folder,
      fileName
    );

    const files = await convertCompressedFileStream(compressedStreamOfFiles);

    if (files.length) {
      return files;
    }

    console.log(`Não foi possível encontrar arquivos no diretório ${folder}`);

    return null;
  }

  async execute(FetchEquipmentsCommand) {
    try {
      const organName = "FUNCEME";
      Logger.info({
        msg: `Iniciando busca de credenciais de acesso para FTP do órgão ${organName}`,
      });

      const credentials =
        await this.#metereologicalOrganRepository.getOrganByName(organName);

      if (credentials === null) {
        return Left.create(
          new Error(
            `Não foi possível buscar credenciais de acesso do FTP da ${organName}`
          )
        );
      }

      // Start a new Connection to FTP
      await this.#ftpAdapter.connect({
        host: credentials.Host,
        user: credentials.User,
        password: credentials.Password,
      });

      // Add timeout?
      const [stationLists, pluviometerList] = await Promise.all([
        this.getFiles(FUNCEME_FTP_DIRECTORIES.directories.station.folder),
        this.getFiles(FUNCEME_FTP_DIRECTORIES.directories.pluviometer.folder),
      ]);

      const [stations, pluviometers] = [
        await EquipmentParser.parse(
          stationLists,
          getLastMeasurements(FetchEquipmentsCommand.getDate(), credentials.Id),
          StationMapper.toDomain
        ),
        await EquipmentParser.parse(
          pluviometerList,
          getLastMeasurements(FetchEquipmentsCommand.getDate(), credentials.Id),
          PluviometerMapper.toDomain
        ),
      ];

      /*stations.forEach((station) => {
        // Is here or delegate to other services?
        if (Reflect.has(station.Measurements, "Et0") === false) {
          const year = FetchEquipmentsCommand.getYesterdayDate().getFullYear();
          const day = FetchEquipmentsCommand.getYesterdayDate().getDay();

          const Et0 = this.#calcEto.calc(station, year, day);

          station.Measurements.Et0 = Et0;
        }
      });*/

      // If throw error but connection still alive?
      await this.#ftpAdapter.close();

      return Right.create({
        stations,
        pluviometers,
      });
    } catch (error) {
      // Logger.error({
      //   msg: "Falha ao executar buscar equipamentos da Funceme.",
      //   obj: error,
      // });

      console.error(error);

      if (error instanceof ConnectionError === false) {
        await this.#ftpAdapter.close();
      }

      //Essencial para o PG-BOSS entender que ocorreu um erro
      return Left.create(error);
    }
  }
}

// Maybe should be a Util
function getLastMeasurements(date, organId) {
  return function (list) {
    const eqps = [];

    list.forEach((data) => {
      const measure = data.Measurements.find((measure) => measure.data == date);
      if (measure) {
        eqps.push({
          Code: data.Code,
          Name: data.Name,
          Latitude: data.Latitude,
          Altitude: data.Altitude,
          Longitude: data.Longitude,
          FK_Organ: organId,
          Measurements: measure,
        });
      }
    });

    return eqps;
  };
}
