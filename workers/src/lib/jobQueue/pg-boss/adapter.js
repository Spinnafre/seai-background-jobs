export class PgBossAdapter {
  _boss;

  static instance = null;

  constructor(connection) {
    this._boss = connection;
  }

  async startMonitoring() {
    console.log("[🕥] Iniciando monitoramento de jobs");
    // Prepares the target database and begins job monitoring.
    await this._boss.start();
  }

  static async create() {
    if (!PgBossAdapter.isInitialized()) {
      const { default: pg } = await import("pg-boss");

      console.log("[⚙️] Criando conexão com o banco de dados de jobs");
      const connection = new pg("postgres://postgres:iaes@jobs_database:5432");

      connection.on("error", (error) => {
        console.error(
          `[❌] Falha ao realizar conexão com o banco de dados de JOBS`
        );

        throw error;
      });

      console.log("[✅] Conexão iniciada com sucesso");

      PgBossAdapter.instance = new PgBossAdapter(connection);
    }

    return PgBossAdapter.instance;
  }

  static isInitialized() {
    return PgBossAdapter.instance !== null;
  }

  // async start() {
  //   await this._boss.start();
  //   return this;
  // }

  async schedule(name_queue, cron, data, options) {
    await this._boss.schedule(name_queue, cron, data, options);
  }

  async fetch(name_queue, qtd) {
    const job = await this._boss.fetch(name_queue, qtd);
    return job;
  }

  async registerJob(name_queue, data, options) {
    return this._boss.send(name_queue, data, options);
  }

  async registerWorker(name_queue, handler) {
    await this._boss.work(name_queue, handler);
  }
}
