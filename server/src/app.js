import express from "express";

import cors from "cors";
console.log("ENV ==== ", process.env);
import { connection } from "./data/connection-pool.js";
import { Logger } from "./lib/logger/logger.js";

const app = express();

app.use(express.json());

app.use((request, response, next) => {
  response.set("access-control-allow-origin", "*");
  response.set("access-control-allow-headers", "*");
  response.set("access-control-allow-methods", "*");
  next();
});

/*
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


*/
app.post("/jobs/schedule", async (req, res) => {
  return res.status(200).json({
    message: "TODO",
  });
});

app.put("/jobs/schedule", async (req, res) => {
  return res.status(200).json({
    message: "TODO",
  });
});

app.get("/jobs/schedule", async (req, res) => {
  try {
    const { queue, page } = req.query;

    const errors = [];

    if (typeof page !== "number" && page < 0) {
      errors.push("Página deve ser númerico e não deve ser menor do que 0");
    }

    if (errors.length) {
      return res.status(400).json({
        status: "error",
        data: errors.join(" , "),
      });
    }

    const dto = {
      queue: queue || null,
      page: page < 0 ? 0 : page,
    };

    const result = await connection.fetchCronJobs(dto);

    return res.status(200).json({
      status: "success",
      data: result,
    });
  } catch (error) {
    Logger.error({
      msg: "Falha ao buscar dados de JOBS",
      obj: error,
    });
    return res.status(404).json({
      status: "error",
      message: "Internal server error",
    });
  }
});

app.put("/jobs/queue", async (req, res) => {
  return res.status(200).json({
    message: "TODO",
  });
});

app.post("/jobs/queue", async (req, res) => {
  try {
    const { jobs } = req.body;

    const errors = [];

    if (jobs === undefined || jobs === null) {
      errors.push("The params 'jobs' not exists");
    }

    if (Array.isArray(jobs) === false) {
      errors.push("The params 'jobs' should be array");
    }

    if (errors.length) {
      return res.status(400).json({
        status: "error",
        data: errors.join(" , "),
      });
    }

    const dto = jobs.map((job) => {
      return {
        name: job.queue,
        data: JSON.stringify(job.data),
        priority: job.priority || 0,
        retrylimit: job.retryLimit || 3,
        retrydelay: job.retryDelay || 15000,
      };
    });

    const result = await connection.registerJob(dto);

    return res.status(201).json({
      status: "success",
      data: result,
    });
  } catch (error) {
    Logger.error({
      msg: "Falha ao buscar dados de JOBS",
      obj: error,
    });
    return res.status(404).json({
      status: "error",
      message: "Internal server error",
    });
  }
});

app.get("/jobs/queue", async (req, res) => {
  try {
    const { queue, state, page } = req.query;

    const errors = [];

    const hasValidStates =
      state &&
      [
        "created",
        "expired",
        "completed",
        "retry",
        "active",
        "failed",
        "cancelled",
      ].includes(state);

    if (hasValidStates == false) {
      errors.push("Estado de jobs não é válido");
    }

    if (typeof page !== "number" && page < 0) {
      errors.push("Página deve ser númerico e não deve ser menor do que 0");
    }

    if (errors.length) {
      return res.status(400).json({
        status: "error",
        data: errors.join(" , "),
      });
    }

    const dto = {
      queue: queue || null,
      state: state || "created",
      page: page < 0 ? 0 : page,
    };

    const result = await connection.fetchCreatedJobs(dto);

    return res.status(200).json({
      status: "success",
      data: result,
    });
  } catch (error) {
    Logger.error({
      msg: "Falha ao buscar dados de JOBS",
      obj: error,
    });
    return res.status(404).json({
      status: "error",
      message: "Internal server error",
    });
  }
});

export default app;
