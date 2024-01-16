import { Logger } from "../../../shared/logger.js";
import { Left, Right } from "../../../shared/result.js";

export class SendUserAccountNotificationController {
  #useCase;

  constructor(useCase) {
    this.#useCase = useCase;
  }

  async handle(request) {
    try {
      const useCaseDTO = {
        to: request.getRecipientEmail(),
        subject: request.getSubject(),
        action: request.getAction(),
        temporaryAccessToken: request.getTemporaryToken(),
      };

      if (request.hasPlainText()) {
        Object.assign(useCaseDTO, {
          text: request.getPlainText(),
        });
      }

      const resultOrError = await this.#useCase.execute(useCaseDTO);

      if (resultOrError.isError()) {
        return Left.create(resultOrError.error().message);
      }

      return Right.create();
    } catch (error) {
      Logger.error({
        msg: "Falha ao executar worker de enviar emails",
        obj: error,
      });
      return Left.create(error);
    }
  }
}
