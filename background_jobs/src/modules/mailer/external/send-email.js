import nodemailer from "nodemailer";
import { MAILER_CONFIG } from "../config/mailer.js";

export class SendEmailService {
  async send(options) {
    const transporter = nodemailer.createTransport({
      host: MAILER_CONFIG.host,
      port: MAILER_CONFIG.port,
      auth: {
        user: MAILER_CONFIG.auth.username,
        pass: MAILER_CONFIG.auth.password,
      },
    });

    const command = {
      from: MAILER_CONFIG.from,
      to: options.to,
      subject: options.subject,
      attachments: options.attachments,
    };

    if (options.text) {
      Object.assign(command, {
        text: options.text,
      });
    }

    if (options.html) {
      Object.assign(command, {
        html: options.html,
      });
    }

    if (options.cc) {
      Object.assign(command, {
        cc: options.cc,
      });
    }

    const info = await transporter.sendMail(command);

    console.log("Message sent: %s", info.messageId);
  }
}
