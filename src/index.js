import express from "express";
import cors from "cors";

import puppeteer from "puppeteer";
import { setTimeout } from "node:timers/promises";

import Joi from "joi";

import { createWriteStream } from "node:fs";
import { Readable, Transform, Writable } from "node:stream";
import { pipeline } from "node:stream/promises";

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
  const { country, type, state } = req.query;

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

    // CONFIGURAÇÃO DE ACESSO A PÁGINA

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
    // FIM DE CONFIGURAÇÃO DE ACESSO A PÁGINA

    //Selecionar região = [BRASIL,N,NE,CO,SE,S]
    const selectStationRegionBtn = await page.$("#estacao-regiao");
    await selectStationRegionBtn.select(country);

    //Selecionar tipo da estação (todas, automaticas, convencionais)
    const selectStationTypeBtn = await page.$("#estacao-tipo");
    await selectStationTypeBtn.select(type);

    //Selecionar tipo da estação (todas, automaticas, convencionais)
    const selectDataTypeBtn = await page.$("#estacao-tipo-dados");
    await selectDataTypeBtn.select("diario");

    await setTimeout(300);

    // Ver a possibilidade de fazer regex com os parâmetros da página
    const defaultStationMeditionsParams = [
      "Precipitação Total (mm)",
      "Temp. Média (°C)",
      "Umi. Média (%)",
      "Vel. do Vento Média (m/s)",
    ];

    // const stationParamsSelect = await page.$("#estacao-parametro");

    const allStationsParams = await page.evaluate(() => {
      const stationParamsOptions =
        document.querySelector("#estacao-parametro").children;

      const stationParamsSanitized = Array.from(stationParamsOptions).map(
        (option) => ({
          label: option.innerHTML,
          value: option.value,
        })
      );
      return stationParamsSanitized;
    });

    const stationParamsLabelsToQuery = allStationsParams
      .filter((params) => {
        return defaultStationMeditionsParams.includes(params.label);
      })
      .map((params) => params.value);

    console.log(stationParamsLabelsToQuery);

    if (!stationParamsLabelsToQuery) {
      await page.close();

      await browser.close();
      throw new Error(
        "Não foi possível obter identificadores dos parâmetros das medições das estações"
      );
    }

    await page.waitForSelector(".btn-green");

    const datas = new Map();

    // Loop por cada parâmetro

    for (const medition of stationParamsLabelsToQuery) {
      //Selecionar medição
      const selectMeditionTypeBtn = await page.$("#estacao-parametro");
      await selectMeditionTypeBtn.select(medition);

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

      console.log("Buscando dados da medição = ", medition);

      if (webResponse) {
        const { estacoes } = webResponse;

        const stationsStream = dataAsStream(estacoes);

        const readableStream = Readable.from(stationsStream);

        const param = medition.split("-")[0];

        // const writable = createWriteStream(
        //   resolve(__dirname, "..", "data", "test.ndjson")
        // );

        const writable = new Writable({
          objectMode: true,
          write(chunk, enc, next) {
            if (!datas.has(chunk.codigo)) {
              datas.set(chunk.codigo, {
                nome: chunk.nome,
                estado: chunk.estado,
                regiao: chunk.regiao,
              });
            }

            datas.set(
              chunk.codigo,
              Object.assign(datas.get(chunk.codigo), {
                [param]: chunk.valor,
              })
            );

            next();
          },
        });

        const sanitize = new Transform({
          objectMode: true,
          transform(chunk, enc, cb) {
            const { codigo, nome, estado, regiao, latitude, longitude, valor } =
              chunk;

            const data = Object.assign(
              {},
              {
                nome,
                codigo,
                estado,
                regiao,
                latitude,
                longitude,
                valor,
              }
            );

            cb(null, data);
          },
        });

        const filterByState = new Transform({
          objectMode: true,
          transform(chunk, enc, cb) {
            const data = chunk;
            if (state) {
              if (state == data.estado) return cb(null, chunk);
              else return cb(null);
            } else {
              cb(null, chunk);
            }
          },
        });

        await pipeline(readableStream, sanitize, filterByState, writable);
      }
    }

    const stationDataToArray = [...datas.values()];

    await page.close();

    await browser.close();

    if (stationDataToArray) {
      return res.status(200).json({
        message: `Sucesso ao obter dados da url ${urlPage}`,
        data: stationDataToArray,
      });
    }

    return res.status(202).json({
      message: "Não foi possível obter dados das estações",
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
