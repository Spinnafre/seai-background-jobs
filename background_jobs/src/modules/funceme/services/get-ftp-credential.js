import { Logger } from "../../../../lib/logger/logger.js";
import { Left, Right } from "../../../shared/result.js";
import { ServiceProtocol } from "../../core/service-protocol.js";

export class GetFtpCredentials extends ServiceProtocol {
  constructor(metereologicalOrganRepository) {
    super();
    this.metereologicalOrganRepository = metereologicalOrganRepository;
  }

  async execute(organName) {
    Logger.info({
      msg: `Iniciando busca de credenciais de acesso para FTP do órgão ${organName}`,
    });

    const result = await this.metereologicalOrganRepository.getOrganByName(
      organName
    );

    if (result === null) {
      return Left.create(
        new Error(
          `Não foi possível buscar credenciais de acesso do FTP da ${organName}`
        )
      );
    }

    return Right.create({
      host: result.host,
      user: result.user,
      password: result.password,
    });
  }
}
