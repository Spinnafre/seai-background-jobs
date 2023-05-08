class EntityProtocol {
  #props = {
    code: "",
    name: "",
    organ: {},
  };

  #id;

  constructor(
    props = {
      code: "",
      name: "",
      organ,
      type,
    },
    id
  ) {
    this.#props = props;
    this.#id = id;
  }

  get id() {
    return this.#id;
  }

  get name() {
    return this.#props.name;
  }

  get code() {
    return this.#props.code;
  }

  get organ() {
    return this.#props.organ;
  }
}

export { EntityProtocol };
