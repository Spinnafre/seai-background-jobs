const { Pool } = require("pg");
const dbConfig = require("../config/database");

const pool = new Pool(dbConfig.jobs[dbConfig.node_env]);

pool.on("error", (error, client) => {
  console.error("Falha ao realizar conexão com o banco de dados de jobs");
  console.error("ERROR : ", error);
});

pool.on("connect", () => {
  console.log("Conectado com sucesso ao banco de dados de jobs");
});

module.exports = { pool };
