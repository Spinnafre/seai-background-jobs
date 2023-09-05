import "../../../src/config/app.js";
import { CalcEtoHandlerFactory } from "../../../src/jobs/calc_eto/factories/handler/calc-eto-handler-factory.js";

const handler = CalcEtoHandlerFactory();

try {
  await handler.handler({
    data: {
      date: "2023-04-10",
    },
  });

  process.exit();
} catch (error) {
  process.exit(1);
}
