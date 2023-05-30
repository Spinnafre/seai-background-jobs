export class PGBoss {
  _boss;

  static instance = null;

  constructor(connection) {
    this._boss = connection;
  }

  static async create() {
    if (!PGBoss.instance) {
      const { default: pg } = await import("pg-boss");

      const connection = new pg("postgres://postgres:iaes@localhost:5433");
      connection.on("error", (error) => console.error(error));

      PGBoss.instance = new PGBoss(connection);
    }

    return PGBoss.instance;
  }

  async init() {
    await this._boss.start();
    return this;
  }

  async fetch(queueName) {
    const job = await this._boss.fetch(queueName, 20);
    return job;
  }

  async insert(queueName, jobs = []) {
    for (let job of jobs) {
      await this._boss.send(queueName, job);
    }
  }

  async publish(queueName, data, options) {
    return this._boss.send(queueName, data, options);
  }

  async subscribe(queueName, handler) {
    this._boss.work(queueName, handler);
  }
}
