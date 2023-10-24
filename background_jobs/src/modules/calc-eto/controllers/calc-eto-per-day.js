import { Left, Right } from "../../../shared/result.js";
import { CalcEtoWorkerDTO } from "../services/dto.js";

export class CalcETOPerDayController {
  calcEtoByDay;
  dbLogger;

  constructor(calcEtoByDay, dbLogger) {
    this.calcEtoByDay = calcEtoByDay;
    this.dbLogger = dbLogger;
  }

  async handle(request) {
    const dto = new CalcEtoWorkerDTO(request);

    try {
      const resultOrError = await this.calcEtoByDay.execute(dto);

      if (resultOrError.isError()) {
        return Left.create(resultOrError.error().message);
      }

      await this.dbLogger.add(this.calcEtoByDay.getLogs());
      return Right.create();
    } catch (error) {
      Logger.error({
        msg: "Falha ao executar worker da funceme.",
        obj: error,
      });

      await this.dbLogger.add({
        message: error.message,
        type: "error",
      });

      //Essencial para o PG-BOSS entender que ocorreu um erro
      return Left.create(error);
    }
  }
}
