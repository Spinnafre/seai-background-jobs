class App {
  constructor(factory) {
    this.factory = factory.create();
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

    await this.factory.execute(params);
  }
}

(async function main() {
  const { DailyStationControllerFactory } = await import(
    "../src/factories/controllers/registerDailyStationsFactory.js"
  );
  const app = new App(DailyStationControllerFactory);
  await app.run();
})();

process.on("uncaughtException", function (err) {
  console.log("Caught exception: " + err);
  process.exit(1);
});

process.on("exit", (code) => {
  console.log(";] Exited with code ", code);
});
