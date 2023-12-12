import { SendNewsletterControllerUseCaseFactory } from "../../../modules/mailer/factories/send-newsletter-controller.factory";
import { SendNewsletterWorker } from "../../handlers";

export const makeSendNewsletterHandler = () => {
  return new SendNewsletterWorker(SendNewsletterControllerUseCaseFactory());
};
