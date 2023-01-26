import express from "express";
import cors from "cors";

import puppeteer from "puppeteer";
import { setTimeout } from "node:timers/promises";

import Joi from "joi";

import { createWriteStream } from "node:fs";
import { Readable, Transform } from "node:stream";

import expect from "node:assert";

import { dataAsStream } from "./server_utils.js";

import { dirname, resolve } from "node:path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));

var app = express();

app.use(express.json());
app.use(
  cors({
    origin: "*",
    methods: "GET,POST",
  })
);

app.get("/test", async (req, res) => {
  const { country, type } = req.query;

  const schema = Joi.object({
    country: Joi.string()
      .valid("BRAZIL", "N", "NE", "CO", "SE", "S")
      .required(),
    type: Joi.string()
      .valid("todas", "automaticas", "convencionais")
      .required(),
  });

  try {
    await schema.validateAsync({
      country,
      type,
    });

    const browser = await puppeteer.launch({
      headless: true,
      args: [
        // "--disable-gpu",
        // "--disable-dev-shm-usage",
        // "--disable-setuid-sandbox",
        "--no-sandbox",
        // "--disable-web-security",
        // "--disable-features=IsolateOrigins",
        // "--disable-site-isolation-trials",
        // "--disable-features=BlockInsecurePrivateNetworkRequests",
      ],
    });

    const page = await browser.newPage();

    await page.setBypassCSP(true);

    page.on("load", () => console.log("Página carregada com sucesso"));
    page.on("error", (err) => console.log("ERROR ", err));

    await page.setViewport({ width: 500, height: 500 });

    await page.setUserAgent(
      "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/84.0.4147.125 Safari/537.36"
    );

    await page.goto("https://mapas.inmet.gov.br", {
      waitUntil: "domcontentloaded",
      timeout: 30000,
    });

    const titlePage = await page.title();
    console.log("Acessando a página > ", titlePage);

    const urlPage = page.url();
    console.log("URL sendo usada > ", urlPage);

    await setTimeout(2000);

    await page.waitForSelector(".sidebar", {
      timeout: 10000,
    });

    await setTimeout(1000);

    //Selecionar região = [BRASIL,N,NE,CO,SE,S]
    const selectStationRegionBtn = await page.$("#estacao-regiao");
    await selectStationRegionBtn.select(country);

    //Selecionar tipo da estação (todas, automaticas, convencionais)
    const selectStationTypeBtn = await page.$("#estacao-tipo");
    await selectStationTypeBtn.select(type);

    await page.waitForSelector(".btn-green");

    const data = await page.$eval("#btn-estacao-BUSCAR", (el) => {
      el.click();
      return el.textContent.trim();
    });
    console.log("Clicando no botão : ", data);

    //Promise para esperar pela a resposta da requisição AJAX
    //Que não seja a requisição do tipo OPTIONS (preflight)
    const xmr = page.waitForResponse(
      (r) =>
        r.request().url().includes("apimapas.inmet.gov.br/dados") &&
        r.request().method() != "OPTIONS"
    );

    //Esperar pela a resposta das requisiçõe ajax específicas
    const ajaxResponse = await xmr;

    const webResponse = await ajaxResponse.json();

    await setTimeout(10000);

    await page.close();

    await browser.close();

    if (webResponse) {
      const { estacoes } = webResponse;

      const stationsStream = dataAsStream(estacoes);

      const readableStream = Readable.from(stationsStream);

      const writable = createWriteStream(
        resolve(__dirname, "..", "data", "test.ndjson")
      );

      readableStream
        .pipe(
          new Transform({
            objectMode: true,
            transform(chunk, enc, cb) {
              const { nome, estado, regiao, latitude, longitude, valor } =
                chunk;

              const data = Object.assign(
                {},
                {
                  nome,
                  estado,
                  regiao,
                  latitude,
                  longitude,
                  valor,
                }
              );

              cb(null, JSON.stringify(data).concat("\n"));
            },
          })
        )
        .pipe(writable);

      return res.status(200).json({
        message: `Sucesso ao obter dados da url ${urlPage}`,
        data: estacoes,
      });
    }

    return res.status(202).json({
      message: "Não foi possível obter dados da estação",
    });
  } catch (error) {
    if (error instanceof Joi.ValidationError) {
      return res.status(400).json(error.details);
    }
    console.log("Deu erro aí meu irmão = ", error);
    return res
      .status(500)
      .json({ message: "Falha ao tentar obter dados da estação" });
  }
});

process.on("uncaughtException", function (err) {
  console.log("Caught exception: " + err);
});
app.listen(3000, function () {
  console.log("Proxy server listening on port " + 3000);
});
