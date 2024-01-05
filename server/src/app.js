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

app.get("/jobs/states", async (req, res) => {
  try {
    const result = await connection.fetchJobsStates();
    const jobs = result.map((raw) => raw.state);
    return res.status(200).json({
      status: "success",
      data: jobs,
    });
  } catch (error) {
    Logger.error({
      msg: "Falha ao buscar lista de stados dos JOBS",
      obj: error,
    });

    return res.status(404).json({
      status: "error",
      message: "Internal server error",
    });
  }
});

app.put("/jobs/schedule", async (req, res) => {
  return res.status(200).json({
    message: "TODO",
  });
});

app.delete("/jobs/schedule", async (req, res) => {
  try {
    if (Reflect.has(req.query, "name") === false) {
      return res.status(404).json({
        status: "error",
        message: "'name' is required",
      });
    }

    const scheduleName = req.query.name;

    const schedule = await connection.fetchScheduleByQueueName(scheduleName);

    if (schedule == null) {
      return res.status(400).json({
        mstatus: "error",
        message: `Schedule ${scheduleName} not exists`,
      });
    }

    await connection.deleteSchedule(scheduleName);

    return res.status(200).json({
      mstatus: "success",
      message: `Schedule ${scheduleName} deleted successfully`,
    });
  } catch (error) {
    Logger.error({
      msg: `Falha ao deleter job`,
      obj: error,
    });

    return res.status(404).json({
      status: "error",
      message: `Falha ao realizar a operação.`,
    });
  }
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

app.post("/jobs/schedule", async (req, res) => {
  try {
    const { data } = req.body;

    const errors = [];

    if (data === undefined || data === null) {
      errors.push("The params 'data' not exists");
    }

    if (errors.length) {
      return res.status(400).json({
        status: "error",
        data: errors.join(" , "),
      });
    }

    const defaultScheduleOptions = {
      tz: "America/Fortaleza",
      priority: 1,
      retryDelay: 60,
      retryLimit: 3,
    };

    const dto = {
      queue: data.queue,
      cron: data.cron,
      timezone: defaultScheduleOptions.tz,
      data: data.data ? JSON.stringify(data.data) : null,
      options: defaultScheduleOptions,
    };

    if (data.options) {
      Object.assign(dto.options, {
        priority: data.priority,
        retryDelay: data.retryDelay,
        retryLimit: data.retryLimit,
      });
    }

    const result = await connection.schedule(dto);

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

app.post("/jobs", async (req, res) => {
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

app.get("/jobs", async (req, res) => {
  try {
    const { queue, state, page } = req.query;

    const errors = [];

    if (typeof page !== "number" && page < 0) {
      errors.push("Página deve ser númerico e não deve ser menor do que 0");
    }

    const dto = {
      queue: queue || null,
      page: page < 0 ? 0 : page,
    };

    if (req.query.state) {
      const hasValidStates = [
        "created",
        "expired",
        "completed",
        "retry",
        "active",
        "failed",
        "cancelled",
      ].includes(req.query.state);

      if (hasValidStates == false) {
        errors.push("Estado de jobs não é válido");
      } else {
        Object.assign(dto, {
          state: req.query.state || "created",
        });
      }
    }

    if (errors.length) {
      return res.status(400).json({
        status: "error",
        data: errors.join(" , "),
      });
    }

    const result = await connection.fetchJobs(dto);

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
