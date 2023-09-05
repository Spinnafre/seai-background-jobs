class DbLogger {
  logRepository;
  constructor(logRepository) {
    this.logRepository = logRepository;
  }

  toPersistency(logs) {
    return Array.isArray(logs) ? logs : [logs];
  }

  async save(logs) {
    throw new Error("Not implemented");
  }

  async add(logs) {
    await this.save(this.toPersistency(logs));
  }
}

export class CalcETOLogger extends DbLogger {
  constructor(logRepository) {
    super(logRepository);
    Object.freeze(this);
  }
  async save(logs) {
    await this.logRepository.create(logs, "Calc_Et0");
  }
}

export class FuncemeDataMinerLogger extends DbLogger {
  constructor(logRepository) {
    super(logRepository);
    Object.freeze(this);
  }
  async save(logs) {
    await this.logRepository.create(logs, "Funceme_Data_Miner");
  }
}
