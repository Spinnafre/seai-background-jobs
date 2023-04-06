import { RegisterDailyStationsController } from "./cli/controllers/registerDailyStations";

const registerDailyStations = new RegisterDailyStationsController({});

await registerDailyStations.execute();

process.on("uncaughtException", function (err) {
  console.log("Caught exception: " + err);
});
