import { EntityProtocol } from "./entity.js";

export class Equipment extends EntityProtocol {
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
