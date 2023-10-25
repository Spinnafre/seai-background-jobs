export class StationReadsBuilder {
  #stationRead = [
    {
      IdRead: 1,
      TotalRadiation: 3,
      MaxRelativeHumidity: 45,
      MinRelativeHumidity: 7,
      AverageRelativeHumidity: 2,
      MaxAtmosphericTemperature: 2,
      MinAtmosphericTemperature: 2,
      AverageAtmosphericTemperature: 3,
      AtmosphericPressure: 3,
      WindVelocity: 2,
      Time: calcEtoInputDTO.getDate(),
      Hour: null,
      FK_Organ: 2,
      FK_Equipment: IdEquipment,
    },
  ];
}
