import fs from "node:fs/promises";
import { Logger } from "../../../shared/logger.js";
import { Left, Right } from "../../../shared/result.js";
import { HTML_TEMPLATES } from "../config/resources.js";
import path from "node:path";
import { FileNotFoundError } from "../errors/FileNotFound.js";
import { fileURLToPath } from "node:url";
import { MAILER_OPTIONS } from "../config/mailer.js";
import { SEAI_API } from "../config/api.js";

export class SendUserAccountNotification {
  constructor(sendMailService, htmlTemplateCompiler, templatesFolders = null) {
    this.sendMail = sendMailService;
    this.htmlTemplateCompiler = htmlTemplateCompiler;
    this.templatesFolders = templatesFolders || HTML_TEMPLATES;
  }

  async execute(request) {
    try {
      const { to, subject, action, token } = request;

      Logger.info(`Iniciando envio de email para  ${to}`);

      const sendEmailDTO = {
        to,
        subject,
      };

      if (Reflect.has(request, "text") && request.text !== null) {
        Object.assign(sendEmailDTO, {
          text: request.text,
        });
      } else {
        if (this.templatesFolders.has(action) === false) {
          Logger.error(
            `Não foi possível identificar template para para o serviço solicitado`
          );
          return Left.create(new FileNotFoundError(action));
        }

        const templateFolder = this.templatesFolders.get(action);

        Logger.info(`Lendo arquivo  de ${templateFolder.path}...`);

        const templateFile = await fs.readFile(
          path.resolve(
            path.dirname(fileURLToPath(import.meta.url)),
            "..",
            templateFolder.path
          ),
          {
            encoding: "utf-8",
          }
        );

        const html = await this.htmlTemplateCompiler.compile({
          file: templateFile,
          args: {
            email: to,
            subject,
            from: MAILER_OPTIONS.from,
            token,
            baseURL: SEAI_API.BASE_URL,
          },
        });

        Object.assign(sendEmailDTO, {
          html,
        });
      }

      await this.sendMail.send(sendEmailDTO);

      Logger.info(`Sucesso ao enviar email para ${to}`);

      return Right.create(`Sucesso ao enviar email para ${to}`);
    } catch (error) {
      Logger.error({
        msg: "Falha ao enviar email.",
        obj: error,
      });

      return Left.create(error);
    }
  }
}
