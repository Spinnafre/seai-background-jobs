import app from "./app.js";

process.on("uncaughtException", function (err) {
  console.log("Caught exception: " + err);
});

app.listen(3000, function () {
  console.log("Server listening on port " + 3000);
});
