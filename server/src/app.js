require("dotenv/config.js");

const express = require("express");

const cors = require("cors");
const { pool } = require("./data/connection.js");

const app = express();

app.use(express.json());
app.use(cors());

app.post("/send-forgot-email", async (req, res) => {
  const { user_email, login, token } = req.query;

  try {
    const command = {
      to: user_email,
      subject: "Redefinição de senha",
      context: { email: user_email, token, login },
      templateName: "forgot_password",
    };

    await pool.query(
      `
      INSERT INTO pgboss.job (
        "name",
        priority,
        "data",
        retrylimit,
        retrydelay
        ) VALUES($1,$2,$3,$4,$5)`,
      ["mailer", 0, command, 3, 15000]
    );

    return res.status(200).json({
      message: "Recebemos o seu email, enviaremos o email assim que possível.",
    });
  } catch (error) {
    console.error(error);
    return res.status(400).json({
      message: "Falha ao enviar email de recuperação de senha",
    });
  }
});

app.post("/send-new-user-email", async (req, res) => {
  const { user_email, token } = req.query;

  try {
    const command = {
      to: user_email,
      subject: "Cadastro de usuário",
      context: { email: user_email, token },
      templateName: "create_user_account",
    };

    await pool.query(
      `
      INSERT INTO pgboss.job (
        "name",
        priority,
        "data",
        retrylimit,
        retrydelay
        ) VALUES($1,$2,$3,$4,$5)`,
      ["mailer", 0, command, 3, 15000]
    );

    return res.status(200).json({
      message: "Recebemos o seu email, enviaremos o email assim que possível.",
    });
  } catch (error) {
    console.error(error);
    return res.status(400).json({
      message: "Falha ao enviar email de cadastro de usuário",
    });
  }
});

app.get("/newsletter/schedule", async (req, res) => {
  return res.status(200).json({
    message: "Recebemos o seu email, enviaremos o email assim que possível.",
  });
});

module.exports = app;
