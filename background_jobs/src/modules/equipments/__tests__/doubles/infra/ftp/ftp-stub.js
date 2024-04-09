import { createReadStream } from "fs";
import { resolve } from "path";
import { pathToFileURL } from "url";

class FTPClientAdapterMock {
  constructor() {
    this.connection = {};
  }

  async close() {
    return new Promise((resolve) => {
      console.log("Closing connection...");
      resolve();
    });
  }

  async status() {
    return new Promise((resolve, reject) => {
      resolve(true);
    });
  }

  async connect() {
    return new Promise((resolve, reject) => {
      resolve(true);
    });
  }

  async getFolderContentDescription(folder) {
    return new Promise((resolve, reject) => {
      resolve(true);
    });
  }

  getFile(folder, file) {
    // /home/spin/dev/nodejs/seai-background-jobs/background_jobs/src/modules/equipments/__tests__/doubles/funceme/data
    console.log(
      "Reading file from : ",
      pathToFileURL(import.meta.url).pathname
    );
    console.log(`[🔍] Getting stream from path ${folder}/${file}`);
    return createReadStream(
      // "background_jobs",
      resolve(
        "src",
        "modules",
        "equipments",
        "__tests__",
        "doubles",
        "funceme",
        "data",
        folder,
        file
      )
    );
  }
}

export { FTPClientAdapterMock };
