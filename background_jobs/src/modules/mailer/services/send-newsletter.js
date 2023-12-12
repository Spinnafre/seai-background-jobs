import { Logger } from "../../../shared/logger.js";
import { Left, Right } from "../../../shared/result.js";
import { mailerConfig } from "../config/mailer.js";
import { toHTML } from "../helpers/convertToBlob.js";

export class SendNewsletterEmail {
  constructor(repository, sendMailAdapter) {
    this.repository = repository;
    this.sendMail = sendMailAdapter;
  }

  async execute(idNews) {
    try {
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

      const contentBuffer = news.Data.data;

      const buffer = Buffer.from(contentBuffer); // converte para buffer de dados binários crús (chunk of data)

      const blob = new Blob([buffer]);

      const html = await toHTML(blob);

      const mailList = subscribers.length
        ? [...subscribers.map((data) => data.Email), ...[mailerConfig.to]].join(
            ","
          )
        : [mailerConfig.to].join(",");

      Logger.info("Enviando newsletter...");

      await this.sendMail.send({
        host: mailerConfig.host,
        port: mailerConfig.port,
        username: mailerConfig.auth.username,
        password: mailerConfig.auth.password,
        from: mailerConfig.from,
        to: mailList,
        subject: "NEWSLETTER",
        text: "TESTANDO NEWSLETTER",
        html,
        cc: "*******",
      });

      Logger.info("Newsletter enviada com sucesso...");

      return Right.create("Sucesso ao enviar notícia");
    } catch (error) {
      Logger.error({
        msg: "Falha ao realizar serialização de dados provindos do FTP.",
        obj: error,
      });

      return Left.create(error);
    }
  }
}
