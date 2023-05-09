export function mapMeasuresNamesToDomain(rawMeasures=[]){
    return rawMeasures.map((measure)=>{
        return mapMeasureNameToDomain(measure)
    })
}

export function mapMeasureNameToDomain(rawMeasure){
    const measuresNames = {
        temperatura: "temperature",
        ventovel: "windSpeed",
        umidade: "humidity",
        precipitacao: "precipitation",
    };

    const measureName = rawMeasure
    return measuresNames[measureName]
}

function mapStationToDomain(station){
    
}

function mapStationsToDomain(stations=[]){
    return stations.map((station)=>mapStationToDomain(station))
}