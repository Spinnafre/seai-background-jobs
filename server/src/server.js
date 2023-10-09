import "dotenv/config.js";

import { serverConfig } from "./config/server.js";
import { Logger } from "./lib/logger/logger.js";

const port = serverConfig.PORT;

const { default: app } = await import("./app.js");

app.listen(port, function () {
  Logger.info({ msg: "Server listening on port " + port });
});

process.on("uncaughtException", function (error) {
  Logger.error({ msg: "Caught exception: " + error.message, obj: error });
  process.exit(1);
});
