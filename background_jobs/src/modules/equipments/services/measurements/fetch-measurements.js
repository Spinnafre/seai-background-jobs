import { Logger } from "../../../../shared/logger.js";
import { Left, Right } from "../../../../shared/result.js";
import { PluviometerMapper, StationMapper } from "../../core/mappers/index.js";
import { CalcEto } from "../../core/et0/calc-eto.js";

export class FetchEquipmentsMeasures {
  #fetchEquipmentsService;
  #equipmentRepository;

  constructor(fetchEquipmentsService, equipmentRepository, calcETO) {
    this.#fetchEquipmentsService = fetchEquipmentsService;
    this.#equipmentRepository = equipmentRepository;
  }

  // OBS: Sempre irá tentar buscar dados de medições do dia anterior a data informada
  async execute(command) {
    Logger.info({
      msg: `Iniciando busca de dados pelo FTP da FUNCEME pela data ${command.getDate()}`,
    });

    // Why not fetch all equipments?
    const [existingStations, existingPluviometers] = await Promise.all([
      this.#equipmentRepository.getEquipments({
        eqpType: "station",
      }),
      this.#equipmentRepository.getEquipments({
        eqpType: "pluviometer",
      }),
    ]);

    if (
      [existingStations.length, existingPluviometers.length].every(
        (cond) => cond === 0
      )
    ) {
      return Left.create(new Error("Não há equipamentos cadastrados"));
    }

    const existingStationsCodes = new Map();
    const existingPluviometersCodes = new Map();

    if (existingStations.length) {
      existingStations.forEach((eqp) =>
        existingStationsCodes.set(eqp.Code, eqp.Id)
      );
    }

    if (existingPluviometers.length) {
      existingPluviometers.forEach((eqp) =>
        existingPluviometersCodes.set(eqp.Code, eqp.Id)
      );
    }

    // stations and pluviometers
    const equipmentsOrError = await this.#fetchEquipmentsService.execute(
      command
    );

    if (equipmentsOrError.isError()) {
      return Left.create(equipmentsOrError.error().message);
    }

    const { stations, pluviometers } = equipmentsOrError.value();

    const [
      oldStationsCodesWithMeasurements,
      oldPluviometersCodesWithMeasurements,
    ] = await Promise.all([
      this.#equipmentRepository.getStationCodesWithMeasurements(
        [...existingStationsCodes.keys()],
        command.getDate()
      ),
      this.#equipmentRepository.getPluviometersCodesWithMeasurements(
        [...existingPluviometersCodes.keys()],
        command.getDate()
      ),
    ]);

    const stationsToUpdate = [];
    const stationsToInsert = [];

    stations.forEach((station) => {
      if (Reflect.has(station.Measurements, "Et0") === false) {
        // Is here or delegate to other services?
        const {
          AverageAtmosphericTemperature,
          MinAtmosphericTemperature,
          MaxAtmosphericTemperature,
          AverageRelativeHumidity,
          MaxRelativeHumidity,
          MinRelativeHumidity,
          AtmosphericPressure,
          TotalRadiation,
          WindVelocity,
        } = station.Measurements;

        const et0 = CalcEto({
          date: command.getYesterdayDate(),
          location: {
            altitude: station?.Altitude || null,
            longitude: station?.Longitude || null,
            latitude: station?.Latitude || null,
          },
          measures: {
            averageAtmosphericTemperature: AverageAtmosphericTemperature,
            minAtmosphericTemperature: MinAtmosphericTemperature,
            maxAtmosphericTemperature: MaxAtmosphericTemperature,
            averageRelativeHumidity: AverageRelativeHumidity,
            maxRelativeHumidity: MaxRelativeHumidity,
            minRelativeHumidity: MinRelativeHumidity,
            atmosphericPressure: AtmosphericPressure,
            totalRadiation: TotalRadiation,
            windVelocity: WindVelocity,
          },
        });

        station.Measurements.Et0 = et0;
      }

      const measurementsAlreadyExists = oldStationsCodesWithMeasurements.has(
        station.Code
      );

      // add to update
      if (measurementsAlreadyExists) {
        stationsToUpdate.push(station);
        return;
      }

      //add to insert
      stationsToInsert.push(station);
    });

    const pluviometersToUpdate = [];
    const pluviometersToInsert = [];

    pluviometers.forEach((pluviometer) => {
      const measurementsAlreadyExists =
        oldPluviometersCodesWithMeasurements.has(pluviometer.Code);

      if (measurementsAlreadyExists) {
        pluviometersToUpdate.push(pluviometer);

        return;
      }

      pluviometersToInsert.push(pluviometer);
    });

    // Is here?
    const equipmentsTypes = await this.#equipmentRepository.getTypes();

    if (stationsToUpdate.length) {
      const stationsToBePersisted = mapEquipmentsToPersistency(
        existingStationsCodes,
        stationsToUpdate,
        equipmentsTypes.get("station"),
        StationMapper.toPersistency,
        command.getDate()
      );

      if (stationsToBePersisted.length) {
        await this.#equipmentRepository.updateStationsMeasurements(
          stationsToBePersisted
        );
      }
    }

    if (pluviometersToUpdate.length) {
      const pluviometersToBePersisted = mapEquipmentsToPersistency(
        existingPluviometersCodes,
        pluviometersToUpdate,
        equipmentsTypes.get("pluviometer"),
        PluviometerMapper.toPersistency,
        command.getDate()
      );

      if (pluviometersToBePersisted.length) {
        await this.#equipmentRepository.updatePluviometersMeasurements(
          pluviometersToBePersisted
        );
      }
    }

    const stationsToBePersisted = mapEquipmentsToPersistency(
      existingStationsCodes,
      stationsToInsert,
      equipmentsTypes.get("station"),
      StationMapper.toPersistency,
      command.getDate()
    );

    // Remove it and replace to one query
    if (stationsToBePersisted.length) {
      await this.#equipmentRepository.insertStationsMeasurements(
        stationsToBePersisted
      );
    }

    const pluviometersToBePersisted = mapEquipmentsToPersistency(
      existingPluviometersCodes,
      pluviometersToInsert,
      equipmentsTypes.get("pluviometer"),
      PluviometerMapper.toPersistency,
      command.getDate()
    );

    if (pluviometersToBePersisted.length) {
      await this.#equipmentRepository.insertPluviometersMeasurements(
        pluviometersToBePersisted
      );
    }

    return Right.create("Sucesso ao salvar medições de equipamentos");
  }
}

// Optimize
function mapEquipmentsToPersistency(
  oldEquipments, //db
  newEquipments, // ftp
  idType,
  mapper,
  date
) {
  const toPersist = [];
  newEquipments.forEach((station) => {
    if (oldEquipments.has(station.Code) === false) {
      return;
    }

    Object.assign(station, {
      FK_Type: idType,
    });

    toPersist.push(mapper(station, date));
  });

  return prepareMeasurementsToPersist(toPersist, oldEquipments);
}

// Optimize
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
