import { Left, Right } from "../../shared/result.js";
import { StationMapper, PluviometerMapper } from "./core/mappers/index.js";

export class FetchEquipments {
  // Should be a array of services?
  #fetchEquipmentsService;
  #equipmentRepository;

  constructor(fetchEquipmentsService, equipmentRepository) {
    this.#fetchEquipmentsService = fetchEquipmentsService;
    this.#equipmentRepository = equipmentRepository;
  }

  async insertStations(stations) {
    console.log("Salvando estações");
    // save equipments, location and measures
    const stationsIds = await this.#equipmentRepository.create(stations);
    console.log("Sucesso ao salvar estações");

    console.log("Salvando medições das estações");

    const stationsMeasurements = prepareMeasurementsToPersist(
      stations,
      stationsIds
    );

    await this.#equipmentRepository.insertStationsMeasurements(
      stationsMeasurements
    );

    console.log("Sucesso ao salvar medições das estações");
  }
  async insertPluviometers(pluviometers) {
    console.log("Salvando pluviômetros");
    // save equipments, location and measures
    const pluviometersIds = await this.#equipmentRepository.create(
      pluviometers
    );

    console.log("Sucesso ao salvar pluviometros");

    console.log("Salvando medições dos pluviômetros");

    const pluviometersMeasurements = prepareMeasurementsToPersist(
      pluviometers,
      pluviometersIds
    );

    await this.#equipmentRepository.insertPluviometersMeasurements(
      pluviometersMeasurements
    );

    console.log("Sucesso ao salvar medições dos pluviômetros");
  }
  // params : Date to Query
  async execute(command) {
    // stations and pluviometers
    const equipmentsOrError = await this.#fetchEquipmentsService.execute(
      command
    );

    if (equipmentsOrError.isError()) {
      return Left.create(equipmentsOrError.error().message);
    }

    const { stations, pluviometers } = equipmentsOrError.value();

    // Replace it to one query
    const [existingStations, existingPluviometers] = await Promise.all([
      this.#equipmentRepository.getEquipments({
        eqpType: "station",
      }),
      this.#equipmentRepository.getEquipments({
        eqpType: "pluviometer",
      }),
    ]);

    // Maybe delegate to SQL insert ON duplicated using the column CODE
    const existingEquipmentsCodes = new Set();

    if (existingStations.length) {
      existingStations.forEach((eqp) => existingEquipmentsCodes.add(eqp.Code));
    }

    if (existingPluviometers.length) {
      existingPluviometers.forEach((eqp) =>
        existingEquipmentsCodes.add(eqp.Code)
      );
    }

    // Is here?
    const equipmentsTypes = await this.#equipmentRepository.getTypes();

    const stationsToBePersisted = mapEquipmentsToPersistency(
      existingEquipmentsCodes,
      stations,
      equipmentsTypes.get("station"),
      StationMapper.toPersistency
    );

    console.log(stationsToBePersisted);

    const pluviometersToBePersisted = mapEquipmentsToPersistency(
      existingEquipmentsCodes,
      pluviometers,
      equipmentsTypes.get("pluviometer"),
      PluviometerMapper.toPersistency,
      command.getDate()
    );

    if (stationsToBePersisted.length) {
      await this.insertStations(stationsToBePersisted);
    }

    if (pluviometersToBePersisted.length) {
      await this.insertPluviometers(pluviometersToBePersisted);
    }

    return Right.create("Sucesso ao carregar equipamentos e medições");
  }
}

function mapEquipmentsToPersistency(
  oldEquipments,
  newEquipments,
  idType,
  mapper,
  date
) {
  const toPersist = [];
  newEquipments.forEach((station) => {
    if (oldEquipments.has(station.Code)) {
      return;
    }

    Object.assign(station, {
      FK_Type: idType,
    });

    toPersist.push(mapper(station, date));
  });

  return toPersist;
}

function prepareMeasurementsToPersist(equipments = [], ids) {
  const measures = [];

  equipments.forEach((station) => {
    if (ids.has(station.IdEquipmentExternal)) {
      station.Measurements.FK_Equipment = ids.get(station.IdEquipmentExternal);
      station.Measurements.FK_Organ = station.FK_Organ;
      measures.push(station.Measurements);
    }
  });

  return measures;
}
