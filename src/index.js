import express from "express";
import cors from "cors";

import puppeteer from "puppeteer";
import { setTimeout } from "node:timers/promises";

var app = express();

app.use(express.json());
app.use(cors());

app.get("/test", async (req, res) => {
  try {
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

    // await page.setViewport({ width: 500, height: 500 });

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

    await setTimeout(1000);

    await page.close();

    await browser.close();

    if (webResponse) {
      const { estacoes } = webResponse;

      return res.status(200).json({
        message: `Sucesso ao obter dados da url ${urlPage}`,
        data: estacoes,
      });
    }

    return res.status(202).json({
      message: "Não foi possível obter dados da estação",
    });
  } catch (error) {
    console.log("Deu erro aí meu irmão = ", error);
    return res
      .status(500)
      .json({ msg: "Falha ao tentar obter dados da estação" });
  }
});

process.on("uncaughtException", function (err) {
  console.log("Caught exception: " + err);
});
app.listen(3000, function () {
  console.log("Proxy server listening on port " + 3000);
});
