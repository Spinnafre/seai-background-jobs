import { DbNewsLetterRepository } from "../../../../shared/database/repositories/Newsletter.js";
import { SendEmailService } from "../../external/send-email.js";
import { SendNewsletterEmail } from "../../services/send-newsletter.js";

export const makeSendNewsletterUseCase = () => {
  return new SendNewsletterEmail(
    new DbNewsLetterRepository(),
    new SendEmailService()
  );
};
