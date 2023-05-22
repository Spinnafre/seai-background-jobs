import { Mapper } from "../../../../core/mappers/mapper.js";

export class MetereologicalEquipmentDao {
  #connection;
  constructor(connection){
    this.#connection = connection
  }

  async getFuncemeStations() {
    const pluviometers = await this.#connection
      .select()
      .where({
        Type:"station",
        Organ:"FUNCEME"
      })
      .from("MetereologicalEquipment")

    return Mapper.equipmentToDomain(pluviometers)
  }

  async getFuncemePluviometers() {
    const pluviometers = await this.#connection
      .select()
      .where({
        Type:"station",
        Organ:"FUNCEME"
      })
      .from("MetereologicalEquipment")

    return Mapper.equipmentToDomain(pluviometers)
  }

  async getInmetPluviometers(){
    const pluviometers = await this.#connection
      .select()
      .where({
        Type:"station",
        Organ:"INMET"
      })
      .from("MetereologicalEquipment")

    return Mapper.equipmentToDomain(pluviometers)
  }
  async getInmetStations(){
    const pluviometers = await this.#connection
      .select()
      .where({
        Type:"station",
        Organ:"INMET"
      })
      .from("MetereologicalEquipment")

    return Mapper.equipmentToDomain(pluviometers)
  }
}
