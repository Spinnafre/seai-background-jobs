import { SendNewsLetterController } from "../../controller/send-newsletter.js";
import { SendNewsletterUseCaseFactory } from "../use-cases/send-newsletter-usecase-factory.js";

export const makeSendNewsletterController = () => {
  return new SendNewsLetterController(SendNewsletterUseCaseFactory());
};
