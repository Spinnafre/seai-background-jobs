import { setTimeout } from "node:timers/promises";

export class ScrapperMock {
  #pageHandler = null;

  #browserInstance = null;

  #scrapperConfig = {
    timeout: 30000,
    userAgent: "",
    bypass: true,
    launch: {
      headless: true,
      args: [],
    },
  };

  constructor(
    scrapperConfig = {
      timeout: 30000,
      userAgent: "",
      bypass: true,
      launch: {
        headless: true,
        args: [],
      },
    }
  ) {
    this.#scrapperConfig = scrapperConfig;
  }

  async launchBrowser() {
    console.log("Abrindo browser...");

    this.#browserInstance = {};
  }

  async openNewTab() {
    console.log("abrindo página");
  }

  async navigateToUrl(url, timeout = 30000) {
    console.log(`Acessando URL: ${url}.`);
  }

  async getJSONResponseFromRequest(url, method) {}

  async closeBrowser() {
    await this.closePage();

    console.log("Closing browser...");
  }

  async closePage() {
    console.log("Closing page...");
  }

  async getElementHandler(selector) {}

  async elementEvaluate(selector, command) {}

  async pageEvaluate(params, command) {}

  async selectInputValue(selector, value) {}

  async waitForElement(selector, timeout) {}

  async setPageWindowViewPort(width = 300, height = 300) {}
}
