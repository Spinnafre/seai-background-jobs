export class NodemailerAdapterStub {
  async send(options) {
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

    console.log("Email successfully sended");
  }
}
