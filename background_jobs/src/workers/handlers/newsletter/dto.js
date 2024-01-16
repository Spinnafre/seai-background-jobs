import { WorkerHandlerDTO } from "../../../shared/workers/handlerDTO.js";

export class NewsletterMailerDTO extends WorkerHandlerDTO {
  constructor(payload) {
    console.log("PAYLOAD >>>>>> ", payload);
    if (payload.length === 0 || payload === null || payload == undefined) {
      throw new Error("Newsletter worker DTO is null or undefined.");
    }

    const request = payload[0];

    if (Reflect.has(request, "data") === false) {
      throw new Error("Payload with data attribute is required");
    }

    if (Reflect.has(request.data, "id") === false) {
      throw new Error("Payload with ID  is required");
    }

    super(request);
    Object.freeze(this);
  }

  getNewsId() {
    if (this.payload.id) return this.payload.id;
  }
}
