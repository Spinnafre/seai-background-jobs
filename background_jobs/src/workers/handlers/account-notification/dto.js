import { WorkerHandlerDTO } from "../../../shared/workers/handlerDTO.js";

export class AccountNotificationDTO extends WorkerHandlerDTO {
  constructor(payload) {
    super(payload);
    Object.freeze(this);
  }

  getRecipientEmail() {
    if (this.payload.id) return this.payload.id;
  }
  getSubject() {
    if (this.payload.subject) return this.payload.subject;
  }
  getAction() {
    if (this.payload.action) return this.payload.action;
  }
  getPlainText() {
    if (this.payload.text) return this.payload.text;
  }
  hasPlainText() {
    return Reflect.has(this.payload, "text") && this.payload.text !== null;
  }
}
