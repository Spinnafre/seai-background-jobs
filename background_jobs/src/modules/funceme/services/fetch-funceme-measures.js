import { Logger } from "../../../shared/logger.js";
import { Left, Right } from "../../../shared/result.js";
import { ServiceProtocol } from "../core/service-protocol.js";

export class FetchFuncemeMeasures extends ServiceProtocol {
  constructor(
    fetchFtpData,
    metereologicalEquipmentsRepository,
    equipmentMeasuresRepository,
    parser,
    mapper,
    directory,
    equipmentType
  ) {
    super();
    this.fetchFtpData = fetchFtpData;
    this.metereologicalEquipmentsRepository =
      metereologicalEquipmentsRepository;
    this.equipmentMeasuresRepository = equipmentMeasuresRepository;
    this.parser = parser;
    this.mapper = mapper;
    this.directory = directory;
    this.equipmentType = equipmentType;
  }

  // Send to Domain Layer
  filterByDate(
    equipmentsData = [{ code: null, name: null, measures: [] }],
    date
  ) {
    const acc = [];

    equipmentsData.filter();
    equipmentsData.forEach((data) => {
      const measure = data.measures.find((measure) => measure.data == date);

      if (measure) {
        acc.push({
          code: data.code,
          ...this.mapper.toDomain(measure),
        });
      }
    });

    return acc;
  }
  // Send to Domain Layer
  filterByEquipmentsCodes(
    data = [{ code: null, name: null, measures: [] }],
    codes = []
  ) {
    return data.filter((measure) => codes.includes(measure.code));
  }

  filterMeasures({ data, params = { codes, date } }) {
    const filteredByEquipments = this.filterByEquipmentsCodes(
      data,
      params.codes
    );

    const filteredByDate = this.filterByDate(filteredByEquipments, params.date);

    return filteredByDate;
  }

  async execute(request) {
    Logger.info({
      msg: `Iniciando busca de dados pelo FTP da FUNCEME pela data ${request.getDate()}`,
    });

    const equipments =
      await this.metereologicalEquipmentsRepository.getEquipments({
        organName: "FUNCEME",
        eqpType: this.equipmentType,
      });

    if (!equipments.length) {
      this.logs.addWarningLog("Não há equipamentos da FUNCEME cadastrados");

      return Left.create(
        new Error("Não há equipamentos da FUNCEME cadastrados")
      );
    }

    this.logs.addInfoLog("Iniciando busca de dados de medições da FUNCEME");

    const equipmentsCodes = equipments.map((eqp) => eqp.code);

    const rawMeasuresOrError = await this.fetchFtpData.getDataFromDirectory(
      this.directory
    );

    if (rawMeasuresOrError.isError()) {
      return Left.create(rawMeasuresOrError.error());
    }

    const rawMeasures = rawMeasuresOrError.value();

    const measuresToDomain = this.filterMeasures({
      data: rawMeasures,
      params: { codes: equipmentsCodes, date: request.getDate() },
    }).map(this.mapper.toDomain);

    console.log({ measuresToDomain });

    const toPersistency = equipments.map((equipment) => {
      const measure = measuresToDomain.find(
        (measure) => measure.code === equipment.code
      );

      if (!measure) {
        this.logs.addWarningLog(
          `Não foi possível obter dados de medição ${equipment.code}, salvando dados sem medições.`
        );

        return this.mapper.toPersistency(equipment, null, request.getDate());
      }

      this.logs.addInfoLog(
        `Sucesso ao obter dados de medição de ${equipment.code}`
      );

      return this.mapper.toPersistency(equipment, measure, request.getDate());
    });

    // yyyy-mm-dd
    await this.equipmentMeasuresRepository.deleteByTime(request.getDate());

    await this.equipmentMeasuresRepository.create(toPersistency);

    this.logs.addInfoLog("Sucesso ao salvar leituras");

    return Right.create();
  }
}
