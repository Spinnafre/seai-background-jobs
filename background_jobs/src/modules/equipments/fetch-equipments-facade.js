import { Left, Right } from "../../shared/result.js";
import { StationMapper, PluviometerMapper } from "./core/mappers/index.js";

export class FetchEquipments {
  // Should be a array of services?
  #fetchEquipmentsService;
  #calcEto = null;
  #equipmentRepository = null;

  constructor(fetchEquipmentsService, equipmentRepository, calcEto) {
    this.#fetchEquipmentsService = fetchEquipmentsService;
    this.#equipmentRepository = equipmentRepository;
    this.#calcEto = calcEto;
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

    // Replace one query
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
      existingStations.forEach((eqp) => existingEquipmentsCodes.add(eqp.code));
    }

    if (existingPluviometers.length) {
      existingPluviometers.forEach((eqp) =>
        existingEquipmentsCodes.add(eqp.code)
      );
    }

    const stationsToBePersisted = [];
    const pluviometersToBePersisted = [];

    // Is here?
    const equipmentsTypes = await this.#equipmentRepository.getTypes();

    stations.forEach((station) => {
      if (existingEquipmentsCodes.has(station.Code)) {
        return;
      }

      Object.assign(station, {
        FK_Type: equipmentsTypes.station,
      });

      stationsToBePersisted.push(
        StationMapper.toPersistency(station, command.getDate())
      );
    });

    pluviometers.forEach((pluviometer) => {
      if (existingEquipmentsCodes.has(pluviometer.Code)) {
        return;
      }

      Object.assign(pluviometer, {
        FK_Type: equipmentsTypes.pluviometer,
      });

      pluviometersToBePersisted.push(
        PluviometerMapper.toPersistency(pluviometer, command.getDate())
      );
    });

    if (stationsToBePersisted.length) {
      console.log("Salvando estações");
      // save equipments, location and measures
      const stationsIds = await this.#equipmentRepository.create(
        stationsToBePersisted
      );
      console.log("Sucesso ao salvar estações");

      console.log("Salvando medições das estações");

      const stationsMeasurements = prepareMeasurementsToPersist(
        stationsToBePersisted,
        stationsIds
      );

      await this.#equipmentRepository.insertStationsMeasurements(
        stationsMeasurements
      );

      console.log("Sucesso ao salvar medições das estações");
    }

    if (pluviometersToBePersisted.length) {
      console.log("Salvando pluviômetros");
      // save equipments, location and measures
      const pluviometersIds = await this.#equipmentRepository.create(
        pluviometersToBePersisted
      );

      console.log("Sucesso ao salvar pluviometros");

      console.log("Salvando medições dos pluviômetros");

      const pluviometersMeasurements = prepareMeasurementsToPersist(
        pluviometersToBePersisted,
        pluviometersIds
      );

      await this.#equipmentRepository.insertPluviometersMeasurements(
        pluviometersMeasurements
      );

      console.log("Sucesso ao salvar medições dos pluviômetros");
    }

    // TO-DO : calc ET0 using stations
    /*const calcEtoOrError = await this.#calcEto.execute(command);

      if (calcEtoOrError.isError()) {
        return Left.create(calcEtoOrError.error());
      }*/

    return Right.create("Sucesso ao carregar equipamentos e medições");
  }
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
