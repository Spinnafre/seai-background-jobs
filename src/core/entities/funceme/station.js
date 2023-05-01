import { EntityProtocol } from "./protocol.js";

class StationReadings extends EntityProtocol {
  #altitude;
  constructor(
    props = {
      code: "",
      name: "",
      latitude: 0,
      longitude: 0,
      altitude: null,
      measures: [],
    }
  ) {
    super({
      code: props.code,
      name: props.name,
      latitude: props.latitude,
      longitude: props.longitude,
      measures: props.measures,
    });

    this.#altitude = props.altitude;
  }

  get altitude() {
    return this.#altitude;
  }
}

// Se percorrer todas as estações, então deve avisar que tal código não existe.
export { StationReadings };
