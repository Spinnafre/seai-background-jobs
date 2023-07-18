import { FuncemeHandler } from "../../src/presentation/handlers/funceme.js";

async function main() {
  await FuncemeHandler({
    date: "29/05/2023",
  });
}

main();
