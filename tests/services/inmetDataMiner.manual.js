import { Scrapper } from "../../src/modules/scrapper/infra/scrapper/webScrapper/adapters/puppeteer.js";
import { InmetDataMiner } from "../../src/modules/scrapper/infra/scrapper/webScrapper/InmetDataMiner.js";

import { StationDataMiner } from "../../src/modules/scrapper/inmet/services/stationDataMiner.js";

import { MetereologicalEquipmentInMemory } from "../../src/modules/scrapper/infra/database/inMemory/entities/metereologicalEquipment.js";

import { StationRead } from "../../src/modules/scrapper/infra/database/inMemory/entities/stationRead.js";

let metereologicalEquipmentDao = null;
let stationReadDao = null;
let service = null;
let dataMiner = null;

const scrapper = new Scrapper({
  bypass: true,
  launch: {
    headless: true,
    args: ["--no-sandbox"],
  },
  timeout: 60000,
  userAgent:
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/84.0.4147.125 Safari/537.36",
});

dataMiner = new InmetDataMiner(scrapper);
metereologicalEquipmentDao = new MetereologicalEquipmentInMemory();
stationReadDao = new StationRead();

service = new StationDataMiner(
  dataMiner,
  metereologicalEquipmentDao,
  stationReadDao
);

const equipments = [
  {
    IdEquipment: 1,
    IdEquipmentExternal: "A305",
    Name: "Fortaleza",
    Altitude: 35,
    Organ: {
      FK_Organ: 2,
      Name: "INMET",
    },
    Type: {
      FK_Type: 1,
      Name: "station",
    },
    CreatedAt: new Date(),
    UpdatedAt: null,
  },
];

await metereologicalEquipmentDao.createMetereologicalEquipment(equipments);

await service.execute();
console.log("logs", service.getLogs());
console.log(await stationReadDao.list());
