import { EntityProtocol } from "./protocol.js";

class StationReadings extends EntityProtocol {
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
    super(props);
  }
}

// Se percorrer todas as estações, então deve avisar que tal código não existe.
export { StationReadings };
