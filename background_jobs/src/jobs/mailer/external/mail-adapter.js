import nodemailer from "nodemailer";
import hbs from "nodemailer-express-handlebars";
import { resolve } from "node:path";

export class NodemailerAdapter {
  async send(options) {
    const transporter = nodemailer.createTransport({
      host: options.host,
      port: options.port,
      auth: {
        user: options.username,
        pass: options.password,
      },
    });

    transporter.use(
      "compile",
      hbs({
        viewEngine: {
          defaultLayout: undefined,
          partialsDir: resolve("./src/jobs/mailer/resources/mail"),
        },
        viewPath: resolve("./src/jobs/mailer/resources/mail"),
        extName: ".html",
      })
    );

    const info = await transporter.sendMail({
      from: options.from,
      to: options.to,
      subject: options.subject,
      template: options.template,
      context: { ...options.context },
    });

    console.log("Message sent: %s", info.messageId);
  }
}
