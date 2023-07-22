import { NodemailerAdapter } from "../external/mail-adapter.js";
import { SendNotification } from "../command-handler/send-notification.js";

export const MailerFactory = () => {
  return new SendNotification(new NodemailerAdapter());
};
