import { makeSendNewsletterController } from "../../../modules/mailer/factories/controller/send-newsletter-controller.factory.js";
import { SendNewsletterWorker } from "../../handlers/index.js";

export const makeSendNewsletterHandler = () => {
  return new SendNewsletterWorker(makeSendNewsletterController());
};
