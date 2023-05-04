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

  get IdEquipment() {
    return this.#idEquipment;
  }

  get code() {
    return this.props.code;
  }

  setIdType(idType) {
    this.#idType = idType;
  }

  setIdEquipment(idEquipment) {
    this.#idEquipment = idEquipment;
  }

  setIdOrgan(idOrgan) {
    this.#idOrgan = idOrgan;
  }

  setIdTime(idTime) {
    this.#idTime = idTime;
  }

  get IdType() {
    return this.#idType;
  }

  get IdOrgan() {
    return this.#idOrgan;
  }

  get IdTime() {
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
