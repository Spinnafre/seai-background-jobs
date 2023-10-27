export const mailerConfig = {
  host: process.env.MAIL_HOST,
  port: Number(process.env.MAIL_PORT),
  auth: {
    username: process.env.MAIL_USERNAME,
    password: process.env.MAIL_PASSWORD,
  },
  from: process.env.MAILER_FROM || "",
  to: "",
  subject: "",
  text: "",
  html: "",
  attachments: [],
};
