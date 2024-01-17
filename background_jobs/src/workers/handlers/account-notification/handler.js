import { AccountNotificationDTO } from "./dto.js";

export class SendUserAccountNotificationWorker {
  static name_queue = "user-account-notification";
  static worker_name = "SendUserAccountNotification";

  static queue_options = {
    limiter: {
      max: 100,
      duration: 5000,
    },
  };

  #controller;

  constructor(controller) {
    this.name_queue = SendUserAccountNotificationWorker.name_queue;
    this.#controller = controller;
  }

  async handler(payload) {
    const dto = new AccountNotificationDTO(payload);

    const resultOrError = await this.#controller.handle(dto);

    if (resultOrError.isError()) {
      throw resultOrError.error();
    }

    return;
  }
}
