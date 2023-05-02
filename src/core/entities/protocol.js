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
  #idType = null;
  #idOrgan = null;
  #idTime = null;

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

  setIdType(idType) {
    this.#idType = idType;
  }

  setIdOrgan(idOrgan) {
    this.#idOrgan = idOrgan;
  }

  setIdTime(idTime) {
    this.#idTime = idTime;
  }

  get idType() {
    return this.#idType;
  }

  get idOrgan() {
    return this.#idOrgan;
  }

  get idTime() {
    return this.#idTime;
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
