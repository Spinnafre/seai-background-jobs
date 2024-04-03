import { env } from "../../../config/index.js";

const MAILER_TRANSPORT_CONFIG = {
  auth: {
    user: null,
    pass: null,
  },
};

if (env == "development") {
  Object.assign(MAILER_TRANSPORT_CONFIG, {
    service: process.env.MAIL_SERVICE,
    auth: {
      type: process.env.AUTH_TYPE,
      user: process.env.MAIL_USERNAME,
      pass: process.env.MAIL_PASSWORD,
      clientId: process.env.OAUTH_CLIENTID,
      clientSecret: process.env.OAUTH_CLIENT_SECRET,
      refreshToken: process.env.OAUTH_CLIENT_REFRESH_TOKEN,
    },
  });
} else {
  Object.assign(MAILER_TRANSPORT_CONFIG, {
    port: Number(process.env.MAIL_PORT_TEST),
    host: process.env.MAIL_HOST_TEST,
    auth: {
      user: process.env.MAIL_USERNAME_TEST,
      pass: process.env.MAIL_PASSWORD_TEST,
    },
  });
}

const MAILER_OPTIONS = {
  from: process.env.MAIL_FROM || "test@gmail.com",
  to: "test@gmail.com",
};

export { MAILER_TRANSPORT_CONFIG, MAILER_OPTIONS };
