class EntityProtocol {
  props = {
    code: "",
    name: "",
    latitude: 0,
    longitude: 0,
    measures: [],
  };

  constructor(
    props = {
      code: "",
      name: "",
      latitude: 0,
      longitude: 0,
      measures: [],
    }
  ) {
    this.props = props;
  }

  get code() {
    return this.props.code;
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

  filterMeasuresByDate(date) {
    this.props.measures = this.measures.filter((row) => row.date === date);

    if (!this.measures) {
      console.log(
        `Error in try to get measure data from date ${date}, data not found.`
      );
      return false;
    }

    return true;
  }
}

export { EntityProtocol };
