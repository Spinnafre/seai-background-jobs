import { SendUserAccountNotificationController } from "../../controller/send-user-account-notification.js";
import { makeSendUserAccountNotificationService } from "../use-cases/send-user-account-notification.js";

export const makeUserAccountNotificationController = () => {
  return new SendUserAccountNotificationController(
    makeSendUserAccountNotificationService()
  );
};
