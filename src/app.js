class Application {
  readTime;
  funcemeDataMiner;
  inmetDataMiner;

  constructor(readTime, funcemeDataMiner, inmetDataMiner) {
    this.readTime = readTime;
    this.funcemeDataMiner = funcemeDataMiner;
    this.inmetDataMiner = inmetDataMiner;
  }
  //Proxy
  async runCommand() {
    try {
      const result = await command.execute();
      // push command result to log
    } catch (error) {
      // push command error to log
    }
  }

  run() {}
}

export { Application };
