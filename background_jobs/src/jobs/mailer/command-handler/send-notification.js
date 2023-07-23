import mailerConfig from "../../config/nodemailer.js";

export class SendNotification {
  static name_queue = "mailer";

  static queue_options = {
    limiter: {
      max: 100,
      duration: 5000,
    },
  };

  constructor(mailerService) {
    this.name_queue = SendNotification.name_queue;
    this.mailerService = mailerService;
  }

  async handler(data) {
    const {
      data: { to, templateName, subject, context },
    } = data;

    await this.mailerService.send({
      port: mailerConfig.port,
      host: mailerConfig.host,
      username: mailerConfig.auth.username,
      password: mailerConfig.auth.password,
      from: "Queue Test <queue@queuetest.com.br>",
      to,
      subject,
      template: templateName,
      context: { ...context },
    });
  }
}
