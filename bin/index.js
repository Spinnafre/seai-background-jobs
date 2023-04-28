import * as dotenv from "dotenv";

dotenv.config();

(async function main() {
  const { DataMinerFactory } = await import(
    "../src/factories/controllers/dataMinerFactory.js"
  );

  const dataMiner = DataMinerFactory.create();
  await dataMiner.execute();
})();

process.on("uncaughtException", function (err) {
  console.log("Caught exception: " + err);
  process.exit(1);
});

process.on("exit", (code) => {
  console.log(";] Exited with code ", code);
});
