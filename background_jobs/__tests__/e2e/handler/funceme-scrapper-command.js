import { FuncemeScrapperCommandFactory } from "../../../src/jobs/scrapper/funceme/factories/command-handler/funceme-scrapper-command-factory.js";

const funcemeScrapperCommand = FuncemeScrapperCommandFactory();

try {
  await funcemeScrapperCommand.handler({
    id: 1,
    data: {
      date: "2023-04-10",
    },
  });

  process.exit();
} catch (error) {
  process.exit(1);
}
