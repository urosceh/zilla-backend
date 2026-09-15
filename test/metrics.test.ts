import assert from "node:assert/strict";
import {AddressInfo} from "node:net";
import test from "node:test";
import express from "express";
import metricsRouter from "../src/api/metrics/metrics.router";
import {InstrumentedRedisClient} from "../src/external/redis/instrumented.redis.client";
import {createHttpMetricsMiddleware, instrumentSequelize, metricsRegistry} from "../src/observability/metrics";

test("exports bounded Prometheus HTTP metrics", async (t) => {
  metricsRegistry.resetMetrics();

  const app = express();
  const apiRouter = express.Router();
  const projectRouter = express.Router();
  const issueRouter = express.Router();
  apiRouter.use(createHttpMetricsMiddleware((req) => (req.headers.tenant === "known-tenant" ? "known-tenant" : "unknown")));
  projectRouter.get("/:projectKey", (_req, res) => res.status(201).json({ok: true}));
  issueRouter.get("/:issueId", (_req, res) => res.status(404).json({ok: false}));
  apiRouter.use("/project", projectRouter);
  apiRouter.use("/issue", issueRouter);
  apiRouter.use("/metrics", metricsRouter);
  app.use("/api", apiRouter);

  const server = app.listen(0);
  await new Promise<void>((resolve) => server.once("listening", resolve));
  t.after(() => server.close());
  const baseUrl = `http://127.0.0.1:${(server.address() as AddressInfo).port}`;

  await fetch(`${baseUrl}/api/project/ABC-123`, {headers: {tenant: "known-tenant"}});
  await fetch(`${baseUrl}/api/project/SECRET-456`, {headers: {tenant: "untrusted-value"}});
  await fetch(`${baseUrl}/api/issue/USER-SPECIFIC-ID`, {headers: {tenant: "known-tenant"}});

  const fakeSequelize = {
    connectionManager: {pool: {size: 2, available: 1, using: 1, waiting: 0}},
    query: async (sql: string) => {
      if (sql.startsWith("DELETE")) throw new Error("expected test error");
      return [];
    },
  } as any;
  instrumentSequelize(fakeSequelize, "known-tenant");
  await fakeSequelize.query("SELECT 1");
  await assert.rejects(fakeSequelize.query("DELETE FROM test"));
  const instrumentedRedis = new InstrumentedRedisClient(
    {
      get: async () => "ok",
      set: async () => Promise.reject(new Error("expected test error")),
      del: async () => 1,
      flushDb: async () => "OK",
      quit: async () => "OK",
    } as any,
    "known-tenant"
  );
  await instrumentedRedis.get("key");
  await assert.rejects(instrumentedRedis.set("key", "value"));

  const response = await fetch(`${baseUrl}/api/metrics`);
  const metrics = await response.text();

  assert.match(response.headers.get("content-type") || "", /^text\/plain; version=0\.0\.4/);
  assert.match(
    metrics,
    /zilla_http_requests_total\{method="GET",route="\/api\/project\/:projectKey",status_code="201",model="unknown",tenant="known-tenant"\} 1/
  );
  assert.match(
    metrics,
    /zilla_http_requests_total\{method="GET",route="\/api\/project\/:projectKey",status_code="201",model="unknown",tenant="unknown"\} 1/
  );
  assert.match(
    metrics,
    /zilla_http_request_duration_seconds_count\{method="GET",route="\/api\/issue\/:issueId",status_code="404",model="unknown",tenant="known-tenant"\} 1/
  );
  assert.doesNotMatch(metrics, /ABC-123|SECRET-456|USER-SPECIFIC-ID|untrusted-value/);
  assert.match(metrics, /# HELP zilla_process_cpu_user_seconds_total/);
  assert.match(metrics, /zilla_db_operations_total\{operation="select",status="success",model="unknown",tenant="known-tenant"\} 1/);
  assert.match(metrics, /zilla_db_operations_total\{operation="delete",status="error",model="unknown",tenant="known-tenant"\} 1/);
  assert.match(metrics, /zilla_redis_operations_total\{operation="set",status="error",model="unknown",tenant="known-tenant"\} 1/);
  assert.match(metrics, /zilla_db_pool_connections\{model="unknown",tenant="known-tenant",state="using"\} 1/);
});
