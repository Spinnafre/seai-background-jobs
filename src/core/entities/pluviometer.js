import { EntityProtocol } from "./protocol.js";

class Pluviometer extends EntityProtocol {
  constructor(
    props = {
      code: "",
      name: "",
      organ: "",
      latitude: 0,
      longitude: 0,
      measures: {},
    },
    id
  ) {
    super(props, id);
  }
}

export { Pluviometer };
