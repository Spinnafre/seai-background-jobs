export class MailerDTO {
  to;
  templateName;
  subject;
  context;

  constructor(payload = { to, templateName, subject, context }) {
    this.to = payload.to;
    this.templateName = payload.templateName;
    this.subject = payload.subject;
    this.context = payload.context;
  }
}
