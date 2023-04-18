class StationReadings {
  props = {
    code: "",
    name: "",
    latitude: 0,
    longitude: 0,
    altitude: 0,
    measures: [],
  };

  constructor(
    props = {
      code: "",
      name: "",
      latitude: 0,
      longitude: 0,
      altitude: 0,
      measures: [],
    }
  ) {
    this.props = props;
  }

  extractMeasuresByDate(date) {
    const data = this.props.measures.find((row) => row.date === date);

    if (data) {
      return data;
    } else {
      console.log(
        `Error in try to get station data from date ${date}, data not found.`
      );

      return null;
    }
  }
  // ideal para mapper
  static mapToJson(string) {
    const data = string.trim().split("\n");

    const info = data.slice(0, 5).map((data) => data.split(":")[1]);

    const [code, name, latitude, longitude, altitude] = info;

    const measures = data.slice(6).map((row) => {
      const [date, temperature, humidity, radiation] = row.split(",");
      return {
        date,
        temperature: parseFloat(temperature) || 0,
        humidity: parseFloat(humidity) || 0,
        radiation: parseFloat(radiation) || 0,
      };
    });

    return {
      code,
      name,
      latitude,
      longitude,
      altitude,
      measures,
    };
  }

  static create(string = "") {
    const data = StationReadings.mapToJson(string);
    return new StationReadings(data);
  }
}
// Se percorrer todas as estações, então deve avisar que tal código não existe.
export { StationReadings };
