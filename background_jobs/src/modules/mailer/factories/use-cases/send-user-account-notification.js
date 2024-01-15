import { DbNewsLetterRepository } from "../../../../shared/database/repositories/Newsletter.js";
import { SendEmailService } from "../../external/send-email.js";
import { SendUserAccountNotification } from "../../services/send-user-account-notification.js";

export const makeSendUserAccountNotificationService = () => {
  return new SendUserAccountNotification(
    new DbNewsLetterRepository(),
    new SendEmailService()
  );
};
