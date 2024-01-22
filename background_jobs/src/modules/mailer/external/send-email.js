import nodemailer from "nodemailer";
import { MAILER_OPTIONS, MAILER_TRANSPORT_CONFIG } from "../config/mailer.js";

export class SendEmailService {
  async send(options) {
    const transporter = nodemailer.createTransport(MAILER_TRANSPORT_CONFIG);

    const command = {
      from: MAILER_OPTIONS.from,
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

    console.log("[SendEmailService] Message sent: %s", info.messageId);
  }
}
