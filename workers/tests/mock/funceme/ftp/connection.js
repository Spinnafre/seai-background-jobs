import { createReadStream } from "fs";
import { resolve } from "path";

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

  getFile(folder, file) {
    console.log(`[🔍] Getting stream from path ${folder}/${file}`);
    return createReadStream(
      resolve("tests", "mock", "funceme", "data", folder, file)
    );
  }
}

export { FTPClientAdapterMock };
