import {
  describe,
  expect,
  test,
  jest,
  afterEach,
  beforeEach,
  beforeAll,
} from "@jest/globals";

import { CalcEtoByDateService } from "../factories/eto/calc-eto-service-factory";

import { CalcET0 } from "../../../src/jobs/calc_eto/handler/handler";

let calcEtoService;
let commandHandler;

describe("# Calc ET0 handler", () => {
  beforeAll(() => {
    calcEtoService = CalcEtoByDateService();
    commandHandler = new CalcET0(calcEtoService);
  });
  test.todo("Should be able to calc ET0 where datetime is equal to payload");
});
