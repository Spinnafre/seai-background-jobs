import { EntityProtocol } from "./protocol.js";

class Pluviometer extends EntityProtocol {
  constructor(
    props = {
      code: "",
      name: "",
      organ,
    },
    id
  ) {
    super(props, id);
  }
}

export { Pluviometer };
