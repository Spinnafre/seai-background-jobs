import { EntityProtocol } from "./protocol.js";

class Station extends EntityProtocol {
  #altitude;

  constructor(
    props = {
      code,
      name: "",
      organ,
      type,
    },
    id,
    altitude
  ) {
    super(props, id);

    this.#altitude = altitude || null;
  }

  get altitude() {
    return this.#altitude;
  }
}

export { Station };
