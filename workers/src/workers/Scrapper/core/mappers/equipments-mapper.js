import { Equipment } from "../equipments/equipment.js";

export class EquipmentMapper {
  static equipmentToDomain(raw) {
    const { IdEquipmentExternal, IdEquipment, Name, Type, FK_Organ, Altitude } =
      raw;

    return new Equipment(
      {
        code: IdEquipmentExternal,
        name: Name,
        organ: {
          id: FK_Organ,
        },
        type: Type.Name,
      },
      IdEquipment,
      Altitude
    );
  }

  static equipmentsToDomain(rawList = []) {
    return rawList.map((raw) => EquipmentMapper.equipmentToDomain(raw));
  }
}
