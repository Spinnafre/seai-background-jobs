// npm run test:dev -i __tests__/units/controllers/funceme-scrapper-command.spec.js
import { beforeAll, describe, expect, jest, test } from "@jest/globals";

import { ConnectionError } from "../../../src/jobs/scrapper/funceme/command-handler/errors/ConnectionError.js";
import { FuncemeScrapperCommand } from "../../../src/jobs/scrapper/funceme/command-handler/funceme-scrapper-command.js";
import { FuncemeDataMinerLogger } from "../../../src/lib/logger/log-register.js";
import { LogsRepositoryInMemory } from "../database/inMemory/entities/logs.js";
import { MetereologicalEquipmentInMemory } from "../database/inMemory/entities/metereologicalEquipment.js";
import pluviometerDataMinerFactory from "../factories/funceme/pluviometer-measures-data-miner.js";
import stationDataMinerFactory from "../factories/funceme/stations-measures-data-miner-service.js";
import { FTPClientAdapterMock } from "../mock/funceme/ftp/connection.js";

let stationDataMinerService = null;
let pluviometerDataMinerService = null;
let ftpClientAdapterMock = null;
let commandLogs = null;
let commandHandler = null;

describe("# Funceme Handler", () => {
  beforeAll(() => {
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

    commandLogs = new FuncemeDataMinerLogger(new LogsRepositoryInMemory());

    commandHandler = new FuncemeScrapperCommand(
      stationDataMinerService,
      pluviometerDataMinerService,
      ftpClientAdapterMock,
      commandLogs
    );
  });
  test("When has equipments, should be able to save pluviometers and stations measures", async function () {
    const logsSpy = jest.spyOn(commandLogs, "save");

    await commandHandler.handler({
      data: {
        date: "2023-04-10",
      },
    });

    expect(logsSpy).toHaveBeenCalledTimes(2);

    expect(logsSpy).toHaveBeenNthCalledWith(1, [
      {
        message: "Iniciando busca de dados de medições das estações da FUNCEME",
        type: "info",
      },
      {
        message: "Sucesso ao obter dados de medição estação A325",
        type: "info",
      },
      {
        message: "Sucesso ao salvar leituras de estações da FUNCEME",
        type: "info",
      },
    ]);

    expect(logsSpy).toHaveBeenNthCalledWith(2, [
      {
        message:
          "Iniciando busca de dados de medições de pluviômetros da FUNCEME",
        type: "info",
      },
      {
        message: "Sucesso ao obter dados de medição do pluviômetro 24330",
        type: "info",
      },
      {
        message: "Sucesso ao salvar leituras de pluviômetros da FUNCEME",
        type: "info",
      },
    ]);
  });

  test("When FTP connection is not working, should be able to log error and throw", async function () {
    const logsSpy = jest.spyOn(commandLogs, "add");

    const ftpConnecMock = jest.spyOn(ftpClientAdapterMock, "connect");

    const errorMessage = `Connection not exists`;

    const error = new ConnectionError(errorMessage);

    ftpConnecMock.mockRejectedValue(error);

    await expect(
      commandHandler.handler({
        data: {
          date: "2023-04-10",
        },
      })
    ).rejects.toThrowError(error);

    expect(logsSpy).toHaveBeenNthCalledWith(1, {
      message: `Falha ao conectar ao FTP da funceme. Error: ${errorMessage}`,
      type: "error",
    });

    expect(jest.spyOn(ftpClientAdapterMock, "close")).not.toBeCalled();
  });

  test("When any service not working, should be able to log error and throw", async function () {
    const logsSpy = jest.spyOn(commandLogs, "add");

    const handlerMock = jest.spyOn(commandHandler, "runAllServices");

    const errorMessage = `Any service not working`;

    const error = new Error(errorMessage);

    handlerMock.mockRejectedValue(error);

    const closeConnectionSpy = jest.spyOn(ftpClientAdapterMock, "close");

    await expect(
      commandHandler.handler({
        data: {
          date: "2023-04-10",
        },
      })
    ).rejects.toThrowError(error);

    expect(logsSpy).toHaveBeenNthCalledWith(1, {
      message: errorMessage,
      type: "error",
    });

    expect(closeConnectionSpy).toBeCalled();
  });

  test("When services take long time than timeout limit, should be able to log error and throw error", async function () {
    const logsSpy = jest.spyOn(commandLogs, "add");

    const handlerMock = jest.spyOn(commandHandler, "runAllServices");

    const errorMessage = `Tempo de 1000 milisegundos excedido.`;

    const error = new Error(errorMessage);

    handlerMock.mockImplementation(() => {
      return new Promise((resolve) => setTimeout(resolve, 5000));
    });

    FuncemeScrapperCommand.timeout = 1000;

    const closeConnectionSpy = jest.spyOn(ftpClientAdapterMock, "close");

    await expect(
      commandHandler.handler({
        data: {
          date: "2023-04-10",
        },
      })
    ).rejects.toThrowError(error);

    expect(logsSpy).toHaveBeenNthCalledWith(1, {
      message: errorMessage,
      type: "error",
    });

    expect(closeConnectionSpy).toBeCalled();
  });
});
