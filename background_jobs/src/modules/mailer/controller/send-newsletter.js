import { Logger } from "../../../shared/logger.js";
import { Left, Right } from "../../../shared/result.js";

export class SendNewsLetterController {
  useCase;
  //   dbLogger;

  constructor(useCase) {
    this.useCase = useCase;
    // this.dbLogger = dbLogger;
  }

  async handle(request) {
    try {
      const idNews = request.getNewsId();
      console.log("IDDD", idNews);

      const resultOrError = await this.useCase.execute(idNews);

      if (resultOrError.isError()) {
        return Left.create(resultOrError.error().message);
      }

      //   await this.dbLogger.add(this.calcEtoByDay.getLogs());
      return Right.create();
    } catch (error) {
      Logger.error({
        msg: "Falha ao executar worker de enviar notícias",
        obj: error,
      });

      // await this.dbLogger.add({
      //   message: error.message,
      //   type: "error",
      // });

      //Essencial para o PG-BOSS entender que ocorreu um erro
      return Left.create(error);
    }
  }
}
