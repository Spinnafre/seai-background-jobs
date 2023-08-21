import { equipments } from "../connection.js";

export class StationReadDao {
  #connection;
  constructor() {
    this.#connection = equipments();
  }

  async getStationReadsByEquipment(idEqp) {
    const data = await this.#connection
      .select()
      .where({
        FK_Equipment: idEqp,
      })
      .from("ReadStations");

    if(!data){
      return null 
    }
    
    return data.map((stationRead)=>{
      return {
        idRead:stationRead.IdRead,
        totalRadiation: stationRead.TotalRadiation,
        relativeHumidity: stationRead.RelativeHumidity,
        atmosphericTemperature : stationRead.AtmosphericTemperature,
        windVelocity: stationRead.WindVelocity
      }
    });
  }
}
