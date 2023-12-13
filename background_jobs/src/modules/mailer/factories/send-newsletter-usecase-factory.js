import { NodemailerAdapter } from "../external/mail-adapter.js";
import { SendNewsletterEmail } from "../services/send-newsletter.js";

export const SendNewsletterUseCaseFactory = () => {
  return new SendNewsletterEmail(new NodemailerAdapter());
};
