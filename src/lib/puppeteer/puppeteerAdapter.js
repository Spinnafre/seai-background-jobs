"use strict";

import puppeteer from "puppeteer";

/*
    args: [
        // "--disable-gpu",
        // "--disable-dev-shm-usage",
        // "--disable-setuid-sandbox",
        "--no-sandbox",
        // "--disable-web-security",
        // "--disable-features=IsolateOrigins",
        // "--disable-site-isolation-trials",
        // "--disable-features=BlockInsecurePrivateNetworkRequests",
      ]
*/

class Scrapper {
  #_provider;
  #_browser;
  #_page=null;
  #_isHeadlessMode=true;

  constructor(config={
    headless:true,
    args:[
        "--no-sandbox"
    ]
  }) {
    this.#_provider = puppeteer;
    this.#isHeadlessMode = config.headless
  }
  get page(){
    return this.#page
  }
  async launchBrowser() {
    this.#browser = await this.#provider.launch(config);
  }
  async openPageInSecureBypass(url){
     this.page = await this.#browser.newPage();

     if(this.#isHeadlessMode==true){

     }

     await this.setPageSecurityBypass()
     
  }

  async setViewPort(width=100, height=100){
    await this.page.setViewport({ width, height });
  }
  async setPageSecurityBypass(){
    // Toggles bypassing page's Content-Security-Policy
     await this.page.setBypassCSP(true);

    await this.page.setUserAgent(
      "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/84.0.4147.125 Safari/537.36"
    );
  }
  async close(){
    await this.page.close();

    await this.#browser.close();
  }
}

const t = new INMETScrapper(puppeteer,config:{});
