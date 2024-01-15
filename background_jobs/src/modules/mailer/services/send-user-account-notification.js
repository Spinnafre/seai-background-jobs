import fs from "node:fs/promises";
import { Logger } from "../../../shared/logger.js";
import { Left, Right } from "../../../shared/result.js";
import { HTML_TEMPLATES } from "../config/resources.js";

export class SendUserAccountNotification {
  constructor(sendMailAdapter, htmlTemplateCompiler, templatesFolders = null) {
    this.sendMail = sendMailAdapter;
    this.htmlTemplateCompiler = htmlTemplateCompiler;
    this.templatesFolders = templatesFolders || HTML_TEMPLATES;
  }

  async execute(request) {
    try {
      const { to, subject, action } = request;

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
          return Left.create(
            new Error(
              `Não foi possível identificar template para para o serviço solicitado`
            )
          );
        }

        const { path } = this.templatesFolders.get(action);

        Logger.info(`Lendo arquivo  de ${path}...`);

        const templateFile = await fs.readFile(path, {
          encoding: "utf-8",
        });

        const html = await this.htmlTemplateCompiler.compile({
          file: templateFile,
          args: {
            email: to,
            subject,
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
