import nodemailer from "nodemailer";

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

    const command = {
      from: options.from,
      to: options.to,
      subject: options.subject,
      text: options.text,
      html: options.html,
      attachments: options.attachments,
    };

    if (options.cc) {
      Object.assign(command, {
        cc: options.cc,
      });
    }

    const info = await transporter.sendMail(command);

    console.log("Message sent: %s", info.messageId);
  }
}
