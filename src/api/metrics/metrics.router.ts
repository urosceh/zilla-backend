import express from "express";
import {metricsRegistry} from "../../observability/metrics";

const router = express.Router();

router.get("/", async (_req, res, next) => {
  try {
    res.setHeader("Content-Type", metricsRegistry.contentType);
    res.end(await metricsRegistry.metrics());
  } catch (error) {
    next(error);
  }
});

export default router;
