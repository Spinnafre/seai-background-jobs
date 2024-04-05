import { SendEmailService } from "../../external/send-email.js";
import { HtmlTemplateEngineAdapter } from "../../external/template-engine-adapter.js";
import { SendUserAccountNotification } from "../../services/send-user-account-notification.js";

export const makeSendUserAccountNotificationService = () => {
  return new SendUserAccountNotification(
    new SendEmailService(),
    new HtmlTemplateEngineAdapter()
  );
};
