class PluviometerReadings {
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
  
    getMeasuresByDate(date) {
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
  
      const [code, name, latitude, longitude] = info;
  
      const measures = data.slice(6).map((row) => {
        const [date, pluviometer] = row.split(",");
        return {
          date,
          pluviometer: parseFloat(pluviometer) || null,
        };
      });
  
      const stationName = name && name.trim();
      const stationCode = code && code.trim();
  
      return {
        code: stationCode,
        name: stationName,
        latitude,
        longitude,
        measures,
      };
    }
  
    static create(string = "") {
      const data = PluviometerReadings.mapToJson(string);
      return new PluviometerReadings(data);
    }
  }
  // Se percorrer todas as estações, então deve avisar que tal código não existe.
  export { PluviometerReadings };
  