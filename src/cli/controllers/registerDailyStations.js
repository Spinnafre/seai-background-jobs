"use strict";

import { setTimeout } from "node:timers/promises";

import Joi from "joi";

import { Readable, Transform, Writable } from "node:stream";
import { pipeline } from "node:stream/promises";

import { dataAsStream } from "../../utils/generator.js";

import { dirname, resolve } from "node:path";
import { fileURLToPath } from "url";
import { scrapperParams } from "../../config/scrapper.js";

const __dirname = dirname(fileURLToPath(import.meta.url));

class RegisterDailyStationsController {
  #service;

  constructor(service) {
    this.#service = service;
  }

  async execute() {
    const { country, stations_type, state, date_type, params } = scrapperParams;
    const schema = Joi.object({
      country: Joi.string()
        .valid("BRAZIL", "N", "NE", "CO", "SE", "S")
        .required(),
      stations_type: Joi.string()
        .valid("todas", "automaticas", "convencionais")
        .required(),
    });

    try {
      //
    } catch (error) {
      // Registrar nos logs
    }
  }
}

export { RegisterDailyStationsController };
