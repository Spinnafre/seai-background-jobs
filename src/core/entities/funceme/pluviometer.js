import { EntityProtocol } from "./protocol.js";

class PluviometerReadings extends EntityProtocol {
  constructor(
    props = {
      code: "",
      name: "",
      latitude: 0,
      longitude: 0,
      measures: [],
    }
  ) {
    super(props);
  }
}

export { PluviometerReadings };
