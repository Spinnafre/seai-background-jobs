import { makeUserAccountNotificationController } from "../../../modules/mailer/factories/controller/send-user-account-notification.js";
import { SendUserAccountNotificationWorker } from "../../handlers/index.js";

export const makeSendAccountNotificationHandler = () => {
  return new SendUserAccountNotificationWorker(
    makeUserAccountNotificationController()
  );
};
