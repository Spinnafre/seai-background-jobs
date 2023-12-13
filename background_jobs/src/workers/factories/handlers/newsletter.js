import { SendNewsletterControllerFactory } from "../../../modules/mailer/factories/send-newsletter-controller.factory.js";
import { SendNewsletterWorker } from "../../handlers/index.js";

export const makeSendNewsletterHandler = () => {
  return new SendNewsletterWorker(SendNewsletterControllerFactory());
};
