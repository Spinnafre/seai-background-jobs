import { SendNewsLetterController } from "../../controller/send-newsletter.js";
import { makeSendNewsletterUseCase } from "../use-cases/send-newsletter-usecase-factory.js";

export const makeSendNewsletterController = () => {
  return new SendNewsLetterController(makeSendNewsletterUseCase());
};
