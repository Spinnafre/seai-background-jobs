import { SendNewsLetterController } from "../controller/send-newsletter";
import { SendNewsletterUseCaseFactory } from "./send-newsletter-usecase-factory";

export const SendNewsletterControllerUseCaseFactory = () => {
  return new SendNewsLetterController(SendNewsletterUseCaseFactory());
};
