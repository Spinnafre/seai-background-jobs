import { config } from "dotenv";
config({
  path: "../../../.env",
});

import { CalcEtoHandlerFactory } from "../../../src/jobs/calc_eto/factories/handler/calc-eto-handler-factory.js";

const handler = CalcEtoHandlerFactory();

try {
  await handler.handler({
    id: 1,
    data: {
      date: "2023-04-10",
    },
  });

  process.exit();
} catch (error) {
  process.exit(1);
}
