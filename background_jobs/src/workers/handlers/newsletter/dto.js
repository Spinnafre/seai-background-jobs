import { WorkerHandlerDTO } from "../../../shared/workers/handlerDTO";

export class NewsletterMailerDTO extends WorkerHandlerDTO {
  constructor(payload) {
    super(payload);
  }

  getNewsId() {
    return this.payload.IdNews;
  }
}
