import { NewsletterMailerDTO } from "./dto.js";

export class SendNewsletterWorker {
  static name_queue = "send-newsletter";
  static worker_name = "SendNewsletter";

  #controller = null;

  constructor(controller) {
    this.name_queue = SendNewsletterWorker.name_queue;
    this.#controller = controller;
  }

  async handler(payload) {
    const dto = new NewsletterMailerDTO(payload);

    const resultOrError = await this.#controller.handle(dto);

    if (resultOrError.isError()) {
      throw resultOrError.error();
    }

    return;
  }
}
