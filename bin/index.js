import * as dotenv from "dotenv";

dotenv.config();

class App {
  constructor(inmetFactory, funcemeFactory) {
    this.inmetController = inmetFactory.create();
    this.funcemeController = funcemeFactory.create();
  }

  async run() {
    const params = {
      country: "NE",
      stations_type: "automaticas",
      state: "CE",
      date_type: "diario",
      params: [
        "Precipitação Total (mm)",
        "Temp. Média (°C)",
        "Umi. Média (%)",
        "Vel. do Vento Média (m/s)",
      ],
    };

    await this.funcemeController.execute();

    // await this.inmetController.execute(params);
  }
}

(async function main() {
  const { InmetDataMinerControllerFactory } = await import(
    "../src/factories/controllers/inmetDataMinerFactory.js"
  );

  const { FuncemeDataMinerControllerFactory } = await import(
    "../src/factories/controllers/funcemeDataMinerFactory.js"
  );

  const app = new App(
    InmetDataMinerControllerFactory,
    FuncemeDataMinerControllerFactory
  );

  await app.run();
})();

process.on("uncaughtException", function (err) {
  console.log("Caught exception: " + err);
  process.exit(1);
});

process.on("exit", (code) => {
  console.log(";] Exited with code ", code);
});
