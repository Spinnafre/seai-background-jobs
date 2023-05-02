import { EntityProtocol } from "./protocol.js";

class Station extends EntityProtocol {
  #altitude;

  constructor(
    props = {
      code: "",
      name: "",
      organ: "",
      altitude: null,
      latitude: null,
      longitude: null,
      measures: {},
    },
    id
  ) {
    super(props, id);

    this.#altitude = props.altitude;
  }

  get altitude() {
    return this.#altitude;
  }
}

export { Station };
