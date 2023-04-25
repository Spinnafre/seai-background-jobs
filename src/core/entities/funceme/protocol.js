class EntityProtocol {
  props = {
    code: "",
    name: "",
    latitude: 0,
    longitude: 0,
    altitude: null,
    measures: [],
  };

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

  get altitude() {
    return this.props.altitude;
  }

  get measures() {
    return this.props.measures;
  }

  getMeasuresByDate(date) {
    const data = this.measures.find((row) => row.date === date);

    if (data) {
      return data;
    } else {
      console.log(
        `Error in try to get measure data from date ${date}, data not found.`
      );

      return null;
    }
  }
}
// Se percorrer todas as estações, então deve avisar que tal código não existe.
export { EntityProtocol };
