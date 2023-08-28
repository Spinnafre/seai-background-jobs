// npm run test:dev -i __tests__/units/services/calc-eto/calc-eto.spec.js

import {
  describe,
  expect,
  test,
  jest,
  afterEach,
  beforeEach,
} from "@jest/globals";
import { CalcETO } from "../../../../src/jobs/calc_eto/services/calc-eto-by-date";
import { MetereologicalEquipmentInMemory } from "../../database/inMemory/entities/metereologicalEquipment";
import { EtoRepositoryInMemory } from "../../database/inMemory/entities/eto";
import { StationReadRepositoryInMemory } from "../../database/inMemory/entities/stationRead";
import { logsRepository } from "../../database/inMemory/entities/logs";

/*
    - calcular ET0 quando há equipamentos
        - verificar os logs se foi cadastrado com sucesso
    - não calcular ET0 quando não tem medições de temperatura 
        - verificar se está salvando nos logs as mensagens corretas
        - verificar se não está sendo salvo dados de ETO
    - não calcular ET0 quando não há nenhuma medição cadastrada
    - não tendo equipamento então não deve calcular dados de et0
*/

describe("# Calc ET0", () => {
  test("When has stations equipments, should be able to calculate measures and ET0 and save", async () => {
    const IdEquipment = 1;

    const equipmentRepository = new MetereologicalEquipmentInMemory([
      {
        IdEquipment,
        IdEquipmentExternal: "23984",
        Name: "Teste",
        Altitude: 35,
        FK_Organ: 2,
        Organ: "FUNCEME",
        Type: "station",
        CreatedAt: new Date(),
        UpdatedAt: new Date(),
      },
    ]);

    const readStations = new StationReadRepositoryInMemory([
      {
        IdRead: 1,
        TotalRadiation: 3,
        RelativeHumidity: 2,
        AtmosphericTemperature: 3,
        WindVelocity: null,
        Time: new Date(),
        FK_Organ: 2,
        FK_Equipment: IdEquipment,
      },
    ]);

    const etoRepository = new EtoRepositoryInMemory();

    const logs = new logsRepository();

    const calcEto = new CalcETO(
      equipmentRepository,
      etoRepository,
      readStations,
      logs
    );

    await calcEto.execute({
      year: 2023,
      day: 28,
    });

    const eto = await etoRepository.getValuesByStation(IdEquipment);

    expect(eto[0]).toEqual({ Value: 1.9100414438642679, FK_Station_Read: 1 });
  });
  test.todo(
    "When stations measures not exists, shouldn't be able to calculate ET0"
  );
  test.todo(
    "When average temperature of the stations equipments not exists, shouldn't be able to calculate ET0"
  );
});
