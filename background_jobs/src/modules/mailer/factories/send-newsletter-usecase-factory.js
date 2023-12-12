import { NodemailerAdapter } from "../external/mail-adapter";
import { SendNewsletterEmail } from "../services/send-newsletter";

export const SendNewsletterUseCaseFactory = () => {
  return new SendNewsletterEmail(new NodemailerAdapter());
};
