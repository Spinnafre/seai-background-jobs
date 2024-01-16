import { NullOrUndefinedError } from "../../../shared/errors/NullOrUndefined.js";
import { RequiredArgument } from "../../../shared/errors/RequiredArgument.js";
import { WorkerHandlerDTO } from "../../../shared/workers/handlerDTO.js";

export class AccountNotificationDTO extends WorkerHandlerDTO {
  constructor(payload) {
    if (payload.length === 0 || payload === null || payload == undefined) {
      throw new NullOrUndefinedError("payload");
    }

    if (Reflect.has(payload, "data") === false) {
      throw new RequiredArgument("data");
    }

    const toValidateBulk = [
      { name: "to", value: Reflect.has(payload.data, "to") },
      {
        name: "subject",
        value: Reflect.has(payload.data, "subject"),
      },
      {
        name: "action",
        value: Reflect.has(payload.data, "action"),
      },
    ];

    for (const argument of toValidateBulk) {
      if (argument.value === false) {
        throw new RequiredArgument(argument.name);
      }
    }

    super(payload);
    Object.freeze(this);
  }

  getRecipientEmail() {
    if (this.payload.to) return this.payload.to;
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
