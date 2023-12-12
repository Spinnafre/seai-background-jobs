export const mailerConfig = {
  auth: {
    username: process.env.MAIL_USERNAME,
    password: process.env.MAIL_PASSWORD,
  },
  port: Number(process.env.MAIL_PORT),
  host: process.env.MAIL_HOST,
  from: process.env.MAIL_FROM,
  to: "admin@gmail.com",
};
