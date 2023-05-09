import puppeteer from "puppeteer";

export class Scrapper {
    #pageHandler = null

    #browserInstance = null

    #scrapperConfig = {
        timeout: 30000,
        userAgent: "",
        bypass: true,
        launch: {
            headless: true,
            args: [],
        },
    }


    constructor(scrapperConfig = {
        timeout: 30000,
        userAgent: "",
        bypass: true,
        launch: {
            headless: true,
            args: [],
        },
    }) {
        this.scrapperConfig = scrapperConfig
    }

    async launchBrowser() {
        console.log("Abrindo browser...")

        this.#browserInstance = await puppeteer.launch(this.#scrapperConfig.launch);
    }

    async openNewTab() {
        if (!this.#browserInstance) {
            throw new Error("Não é possível abrir uma nova página pois não há uma instância do navegador criada.")
        }

        this.#pageHandler = await this.#browserInstance.newPage();

        await this.#pageHandler.setBypassCSP(this.#scrapperConfig.bypass);

        this.#pageHandler.on("load", () => console.log("Página carregada com sucesso"));
        this.#pageHandler.on("error", (err) => console.log("Erro ao  ", err));
    }

    async navigateToUrl(url, timeout = 30000) {
        console.log(`Acessando URL: ${url}.`);

        await this.#pageHandler.goto(url, {
            waitUntil: "domcontentloaded",
            timeout: timeout,
        });

        const pageTitle = await this.#pageHandler.title();

        console.log(`Página ${pageTitle} carregada com sucesso :)`);
    }

    async getJSONResponseFromRequest(url, method) {
        //Promise para esperar pela a resposta da requisição AJAX
        //Que não seja a requisição do tipo OPTIONS (preflight)
        const xmr = this.#pageHandler.waitForResponse(
            (r) =>
                r.request().url().includes(url) &&
                r.request().method() != method
        );

        //Esperar pela a resposta das requisiçõe ajax específicas
        const ajaxResponse = await xmr;

        const response = await ajaxResponse.json();

        return response;
    }

    async closeBrowser() {
        await this.closePage()

        console.log("Closing browser...");
        await this.#browserInstance.close();
    }

    async closePage() {
        console.log("Closing page...");
        await this.#pageHandler.close();
    }

    async getElementHandler(selector) {
        const elementHandler = await this.#pageHandler.$(selector);
        return elementHandler
    }

    async elementEvaluate(selector, command) {
        await this.#pageHandler.$eval(selector, command);
    }

    async pageEvaluate(params, command) {
        const data = await this.#pageHandler.evaluate(command, params);
        return data;
    }

    async selectDropdown(elementHandler, value) {
        await elementHandler.select(value);
    }

    async waitForElement(selector, timeout) {
        if (timeout) {
            await this.#pageHandler.waitForSelector(selector, {
                timeout,
            });
        }
        await this.#pageHandler.waitForSelector(selector);
    }

    async setPageWindowViewPort(width = this.#pageViewport.width, height = this.#pageViewport.height) {
        if (this.#scrapperConfig.launch.headless) {
            throw new Error("Não é possível definir viewport da página quando estiver em modo headless")
        }

        await this.#pageHandler.setViewport({ width, height });
    }
}