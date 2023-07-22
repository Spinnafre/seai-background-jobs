const app = require("./app.js");

process.on("uncaughtException", function (err) {
  console.log("Caught exception: " + err);
  process.exit(1);
});

app.listen(3000, function () {
  console.log("Server listening on port " + 3000);
});
