class EntityProtocol {
  props = {
    code: "",
    name: "",
    organ: "",
    latitude: 0,
    longitude: 0,
    measures: {},
  };

  #idEquipment;

  constructor(
    props = {
      code: "",
      name: "",
      organ: "",
      latitude: null,
      longitude: null,
      measures: {},
    },
    id
  ) {
    this.props = props;
    this.#idEquipment = id;
  }

  get idEquipment() {
    return this.#idEquipment;
  }
  get code() {
    return this.props.code;
  }

  get organ() {
    return this.props.organ;
  }

  get name() {
    return this.props.name;
  }

  get latitude() {
    return this.props.latitude;
  }

  get longitude() {
    return this.props.longitude;
  }

  get measures() {
    return this.props.measures;
  }
}

export { EntityProtocol };
