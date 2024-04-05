import { env } from "../../../config/index.js";

const MAILER_TRANSPORT_CONFIG = {
  auth: {
    user: null,
    pass: null,
  },
};

if (env == "development") {
  Object.assign(MAILER_TRANSPORT_CONFIG, {
    port: Number(process.env.MAIL_PORT_DEV),
    host: process.env.MAIL_HOST_DEV,
    auth: {
      user: process.env.MAIL_USERNAME_DEV,
      pass: process.env.MAIL_PASSWORD_DEV,
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
  from: MAILER_TRANSPORT_CONFIG.auth.user,
  to: "test@gmail.com", //???
};

export { MAILER_TRANSPORT_CONFIG, MAILER_OPTIONS };
