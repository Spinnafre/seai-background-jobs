import { Logger } from "../../../shared/logger.js";
import { Left, Right } from "../../../shared/result.js";
import { MAILER_CONFIG } from "../config/mailer.js";
import { bufferToBlob, blobToHTML } from "../helpers/convertToBlob.js";

export class SendNewsletterEmail {
  constructor(repository, sendMailAdapter) {
    this.repository = repository;
    this.sendMail = sendMailAdapter;
  }

  async execute(request) {
    try {
      const { idNews } = request;

      Logger.info(`Iniciando envio de emails da notícia ${idNews}`);

      const news = await this.repository.getNewsById(idNews);

      if (news === null) {
        return Left.create(new Error(`Notícia ${idNews} não existe`));
      }

      const subscribers = await this.repository.getSubscribers();

      if (subscribers === null) {
        Logger.warn({
          msg: `Não há leitores inscritos na notícia ${idNews}`,
        });
      }

      console.log(news);

      const html = await blobToHTML(bufferToBlob(news.Data));

      const mailList =
        subscribers && subscribers.length
          ? [
              ...subscribers.map((data) => data.Email),
              ...[MAILER_CONFIG.to],
            ].join(",")
          : [MAILER_CONFIG.to].join(",");

      Logger.info("Enviando newsletter...");

      await this.sendMail.send({
        to: mailList,
        subject: "NEWSLETTER",
        html,
        cc: "*******",
      });

      Logger.info("Newsletter enviada com sucesso...");

      return Right.create("Sucesso ao enviar notícia");
    } catch (error) {
      Logger.error({
        msg: "Falha ao enviar notícias.",
        obj: error,
      });

      return Left.create(error);
    }
  }
}
