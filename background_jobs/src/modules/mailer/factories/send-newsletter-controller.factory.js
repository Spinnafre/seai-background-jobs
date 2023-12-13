import { SendNewsLetterController } from "../controller/send-newsletter.js";
import { SendNewsletterUseCaseFactory } from "./send-newsletter-usecase-factory.js";

export const SendNewsletterControllerFactory = () => {
  return new SendNewsLetterController(SendNewsletterUseCaseFactory());
};
