import express from "express";
import cors from "cors";
import { QueueManager } from "./lib/jobQueue/manager.js";

import dotenv from "dotenv";

QueueManager.getConnection().then(() =>
  console.log("Connected to Jobs Queue...")
);

const app = express();

app.use(express.json());
app.use(cors());

app.get("/test", async (req, res) => {
  return res.status(200).json({ msg: "PONG" });
});

export default app;
