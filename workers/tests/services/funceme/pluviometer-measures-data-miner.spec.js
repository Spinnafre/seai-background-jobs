// npm run test:dev -i tests/services/funcemeDataMiner.spec.js
import {
  describe,
  expect,
  test,
  jest,
  afterEach,
  beforeEach,
  beforeAll,
  afterAll,
} from "@jest/globals";

describe("#Pluviometer-Measures-Data-Miner", () => {
  beforeAll(() => {
    jest.useFakeTimers("modern");
    jest.setSystemTime(new Date(2023, 4, 2));
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  test.todo(
    "When has equipments but measures not exists, should be able to save measures data with null"
  );

  test.todo(
    "When has stations measures in funceme stations files, should create log with success and save stations with measures"
  );
  test.todo(
    "When stations codes not exists in funceme stations files, should create log with error and save stations without measures"
  );
});
