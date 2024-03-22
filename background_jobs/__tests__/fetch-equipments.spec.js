import { FUNCEME_FTP_DIRECTORIES } from "../src/modules/funceme/config/funceme-ftp-directories.js";
import {
  StationMapper,
  PluviometerMapper,
} from "../src/modules/funceme/core/mappers/index.js";
import { PluviometerParser } from "../src/modules/funceme/core/parser/pluviometer-parser.js";
import { StationParser } from "../src/modules/funceme/core/parser/station-parser.js";
import { DateFormatter } from "../src/shared/date-formatter.js";
import { Logger } from "../src/shared/logger";
import { Left, Right } from "../src/shared/result";

describe("Name of the group", () => {
  class Equipment {
    Code;
    Type;
    Name;
    Coordinates = {
      Latitude: null,
      Longitude: null,
    };
    Altitude;
    _Measurements;

    constructor(props) {
      this.Altitude = props.Altitude;
      this.Code = props.Code;
      this.Coordinates = props.Coordinates;
      this.Type = props.Type;
      this._Measurements = props.Measurements;
    }

    // Daily measurements
    get Measurements() {
      throw new Error("Not implemented");
    }
  }

  class Station extends Equipment {
    constructor(props) {
      super(props);
    }

    get Measurements() {
      const {
        Date,
        TotalRadiation,
        MaxRelativeHumidity,
        MinRelativeHumidity,
        AverageRelativeHumidity,
        MaxAtmosphericTemperature,
        MinAtmosphericTemperature,
        AverageAtmosphericTemperature,
        AtmosphericPressure,
        WindVelocity,
      } = this._Measurements;
      return {
        Date,
        TotalRadiation,
        MaxRelativeHumidity,
        MinRelativeHumidity,
        AverageRelativeHumidity,
        MaxAtmosphericTemperature,
        MinAtmosphericTemperature,
        AverageAtmosphericTemperature,
        AtmosphericPressure,
        WindVelocity,
      };
    }
  }

  class Pluviometer extends Equipment {
    constructor(props) {
      super(props);
    }

    get Measurements() {
      const { Date, Pluviometer } = this._Measurements;
      return {
        Date,
        Pluviometer,
      };
    }
  }

  class EquipmentInMemoryDatabase {
    equipments = [
      {
        IdEquipment: null,
        IdEquipmentExternal: null,
        Name: null,
        Altitude: null,
        FK_Organ: null,
        Fk_Type: null,
        CreatedAt: null,
      },
    ];
    // Return equipments codes that already exists
    async getEquipmentsByCodes(codes = []) {
      return ["ABC", "BCA"];
    }
  }

  function stationToDomain(raw) {
    return new Station(raw);
  }

  function pluviometerToDomain(raw) {
    return new Pluviometer(raw);
  }

  // Pass to FetchFunceme Service
  class FetchFuncemeEquipmentCommand {
    #currentDate;
    constructor() {
      this.#currentDate = new Date();
    }

    getDateToQuery() {
      const yesterDayDate = DateFormatter.getPreviousDate(this.#currentDate, 1);
      return yesterDayDate;
    }

    getDay() {
      return DateFormatter.padTo2Digits(this.getDateToQuery().getDate());
    }

    getYear() {
      return this.getDateToQuery().getFullYear();
    }

    getDate() {
      return DateFormatter.formatByDateSeparator(this.getDateToQuery(), {
        separator: "-",
      });
    }
  }

  function filterEquipmentMeasurementsByDate(
    equipmentsData = [{ code: null, name: null, measures: [] }],
    date
  ) {
    const acc = [];

    equipmentsData.forEach((data) => {
      const measure = data.measures.find((measure) => measure.data == date);

      if (measure) {
        acc.push({
          code: data.code,
          name: data.name,
          measures: measure,
        });
      }
    });

    return acc;
  }

  class EquipmentSerializer {
    constructor(parser, mapper, filter) {
      this.parser = parser;
      this.filter = filter;
      this.mapper = mapper;
    }

    async parse(list) {
      if (list.length) {
        const raw = await this.parser.parse(list);
        return this.filter(raw).map(this.mapper.toDomain);
      }

      return null;
    }
  }

  // Fetch Funceme Equipments
  class FetchFuncemeEquipments {
    #ftpAdapter;

    constructor(ftpClientAdapter) {
      this.#ftpAdapter = ftpClientAdapter;
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

      const compressedStreamOfFiles = await this.ftpConnection.getFile(
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

    async execute(FetchEquipmentsCommand = new FetchFuncemeEquipmentCommand()) {
      const [stationLists, pluviometerList] = await Promise.all([
        this.getFiles(FUNCEME_FTP_DIRECTORIES.directories.station.folder),
        this.getFiles(FUNCEME_FTP_DIRECTORIES.directories.pluviometer.folder),
      ]);

      const [stations, pluviometer] = [
        new EquipmentSerializer(StationParser, StationMapper, (list) =>
          filterEquipmentMeasurementsByDate(
            list,
            FetchEquipmentsCommand.getDate()
          )
        ).parse(stationLists),
        new EquipmentSerializer(PluviometerParser, PluviometerMapper, (list) =>
          filterEquipmentMeasurementsByDate(
            list,
            FetchEquipmentsCommand.getDate()
          )
        ).parse(pluviometerList),
      ];

      return {
        stations,
        pluviometer,
      };
    }
  }

  test("should be able to fetch equipments", () => {
    // Fetch from FTP
    const equipmentsFTP = {
      stations: new Map([
        [
          "B8524",
          {
            Id: 1,
            Coordinates: ["Latitude", "Longitude"],
            Altitude: 11 || null,
            Measurements: {
              Date: "2024-01-10",
              AverageTemperature: 1 || null,
              MaxTemperature: 1 || null,
              MinTemperature: 1 || null,
              RelativeHumidity: 1 || null,
              MaxRelativeHumidity: 1 || null,
              MinRelativeHumidity: 1 || null,
              AtmosphericPressure: 1 || null,
              Radiation: 1 || null,
            },
          },
        ],
      ]),
      pluviometers: new Map([
        [
          "B8524",
          {
            Id: 1,
            Coordinates: ["Latitude", "Longitude"],
            Altitude: 11 || null,
            Measurements: {
              Date: "2024-01-10",
              Precipitation: 10,
            },
          },
        ],
      ]),
    };

    const toPersistency = [];

    const equipmentsFromDatabase = {
      stations: {
        B8524: "FORTALEZA",
        A8524: "AQUIRAZ",
        C8524: "BELÉM",
      },
      pluviometers: {
        D8524: "BELÉM",
      },
    };
  });
});
