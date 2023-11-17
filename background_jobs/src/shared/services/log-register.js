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

  async addError(log) {
    await this.add({
      message: log,
      type: "error",
    });
  }
}

export class CalcETOLogger extends DbLogger {
  constructor(logRepository) {
    super(logRepository);
    Object.freeze(this);
  }
  async save(logs) {
    const toPersistency = logs.map((log) => {
      const logData = {
        Operation: "Calc ETO",
        Message: log.message,
        Status: log.type,
      };

      if (Reflect.has(log, "raw") && Reflect.has(log.raw, "equipment")) {
        Object.assign(logData, {
          FK_Equipment: log.raw.equipment,
        });
      }
      return logData;
    });

    await this.logRepository.create({
      logs: toPersistency,
      tableName: "ETL",
    });
    // await this.logRepository.create(logs, "Calc_Et0");
  }
}

export class FuncemeDataMinerLogger extends DbLogger {
  constructor(logRepository) {
    super(logRepository);
    Object.freeze(this);
  }
  async save(logs) {
    const toPersistency = logs.map((log) => {
      const logData = {
        Operation: "Equipments measures",
        Message: log.message,
        Status: log.type,
      };

      if (Reflect.has(log, "raw") && Reflect.has(log.raw, "equipment")) {
        Object.assign(logData, {
          FK_Equipment: log.raw.equipment,
        });
      }
      return logData;
    });

    await this.logRepository.create({
      logs: toPersistency,
      tableName: "ETL",
    });
  }
}
