import { Logger } from "../../../shared/logger.js";
import { Left, Right } from "../../../shared/result.js";

export class SendNewsLetterController {
  #useCase;

  constructor(useCase) {
    this.#useCase = useCase;
  }

  async handle(request) {
    try {
      const idNews = request.getNewsId();

      const resultOrError = await this.#useCase.execute({ idNews });

      if (resultOrError.isError()) {
        return Left.create(resultOrError.error().message);
      }

      return Right.create();
    } catch (error) {
      Logger.error({
        msg: "Falha ao executar worker de enviar notícias",
        obj: error,
      });

      //Essencial para o PG-BOSS entender que ocorreu um erro
      return Left.create(error);
    }
  }
}
