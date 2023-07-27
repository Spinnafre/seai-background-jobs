// npm run test:dev -i tests/handlers/funceme-scrapper-command.spec.js
import {
  describe,
  expect,
  test,
  jest,
  afterEach,
  beforeEach,
} from "@jest/globals";

import pluviometerDataMinerFactory from "../factories/funceme/pluviometer-measures-data-miner.js";
import stationDataMinerFactory from "../factories/funceme/stations-measures-data-miner-service.js";
import { FTPClientAdapterMock } from "../mock/funceme/ftp/connection.js";
import { logsRepository } from "../database/inMemory/entities/logs.js";
import { FuncemeScrapperCommand } from "../../../src/jobs/scrapper/funceme/command-handler/funceme-scrapper-command.js";
import { MetereologicalEquipmentInMemory } from "../database/inMemory/entities/metereologicalEquipment.js";

let stationDataMinerService = null;
let pluviometerDataMinerService = null;
let ftpClientAdapterMock = null;
let commandLogs = null;
let commandHandler = null;

const equipmetsDao = new MetereologicalEquipmentInMemory([
  {
    IdEquipment: 1,
    IdEquipmentExternal: "A325",
    Name: "Fortaleza",
    Altitude: 35,
    FK_Organ: 2,
    Organ: "FUNCEME",
    Type: "station",
    CreatedAt: new Date(),
    UpdatedAt: null,
  },
  {
    IdEquipment: 2,
    IdEquipmentExternal: "24330",
    Name: "Teste",
    Altitude: null,
    FK_Organ: 2,
    Organ: "FUNCEME",
    Type: "pluviometer",
    CreatedAt: new Date(),
    UpdatedAt: null,
  },
]);

stationDataMinerService = stationDataMinerFactory(equipmetsDao);

pluviometerDataMinerService = pluviometerDataMinerFactory(equipmetsDao);

ftpClientAdapterMock = new FTPClientAdapterMock();

commandLogs = new logsRepository();

commandHandler = new FuncemeScrapperCommand(
  stationDataMinerService,
  pluviometerDataMinerService,
  ftpClientAdapterMock,
  commandLogs
);

describe("# Funceme Handler", () => {
  test("When has equipments, should be able to save pluviometers and stations measures", async function () {
    const logsSpy = jest.spyOn(commandLogs, "create");

    await commandHandler.handler({
      data: {
        date: "2023-04-10",
      },
    });

    const logs = commandLogs.logs;

    const successFullInsertPluviometerLog = logs.find(
      (log) =>
        log.Message === "Sucesso ao salvar leituras de pluviômetros da FUNCEME"
    );

    const successFullInsertStationsLog = logs.find(
      (log) =>
        log.Message === "Sucesso ao salvar leituras de estações da FUNCEME"
    );

    expect(logsSpy).toHaveBeenCalledTimes(2);

    expect(logsSpy).toHaveBeenNthCalledWith(1, [
      {
        type: "info",
        message: "Iniciando busca de dados de medições das estações da FUNCEME",
      },
      {
        type: "info",
        message: "Sucesso ao salvar leituras de estações da FUNCEME",
      },
    ]);

    expect(logsSpy).toHaveBeenNthCalledWith(2, [
      {
        type: "info",
        message:
          "Iniciando busca de dados de medições de pluviômetros da FUNCEME",
      },
      {
        type: "info",
        message: "Sucesso ao salvar leituras de pluviômetros da FUNCEME",
      },
    ]);

    expect(successFullInsertPluviometerLog).not.toBeUndefined();
    expect(successFullInsertStationsLog).not.toBeUndefined();

    expect(successFullInsertStationsLog).toMatchObject({
      Message: "Sucesso ao salvar leituras de estações da FUNCEME",
    });
    expect(successFullInsertPluviometerLog).toMatchObject({
      Message: "Sucesso ao salvar leituras de pluviômetros da FUNCEME",
    });
  });
});
