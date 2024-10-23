import express from "express";
import sequelize from "../../database/sequelize";

const healthRouter = express.Router();

healthRouter.get("/", (req, res) => {
  res.status(200).send("OK");
});

healthRouter.get("/ready", async (req, res) => {
  await sequelize.query("SELECT version()");

  res.status(200).send("OK");
});

export default healthRouter;
