import {RequestHandler} from "express";
import {collectDefaultMetrics, Counter, Gauge, Histogram, Registry} from "prom-client";
import {Sequelize} from "sequelize";

const HTTP_LABELS = ["method", "route", "status_code", "model", "tenant"] as const;
const OPERATION_LABELS = ["operation", "status", "model", "tenant"] as const;
const ALLOWED_MODELS = new Set(["iso", "hybrid", "shared", "grouped"]);
const ALLOWED_ROUTE_PREFIXES = new Set([
  "health",
  "metrics",
  "user",
  "admin",
  "project",
  "access",
  "sprint",
  "issue",
  "issue-status",
]);

export const metricsRegistry = new Registry();

function configuredModel(): string {
  const model = process.env.ZILLA_MODEL?.toLowerCase();
  return model && ALLOWED_MODELS.has(model) ? model : "unknown";
}

export function normalizeTenant(tenant: unknown): string {
  return typeof tenant === "string" && /^[a-z0-9][a-z0-9-]{0,62}$/.test(tenant) ? tenant : "unknown";
}

collectDefaultMetrics({
  prefix: "zilla_",
  register: metricsRegistry,
  labels: {model: configuredModel()},
});

export const httpRequestsTotal = new Counter({
  name: "zilla_http_requests_total",
  help: "Total number of HTTP requests handled by Zilla",
  labelNames: HTTP_LABELS,
  registers: [metricsRegistry],
});

export const httpRequestDurationSeconds = new Histogram({
  name: "zilla_http_request_duration_seconds",
  help: "Duration of HTTP requests handled by Zilla in seconds",
  labelNames: HTTP_LABELS,
  buckets: [0.005, 0.01, 0.025, 0.05, 0.1, 0.25, 0.5, 1, 2.5, 5],
  registers: [metricsRegistry],
});

export const httpRequestsInFlight = new Gauge({
  name: "zilla_http_requests_in_flight",
  help: "Number of HTTP requests currently being handled by Zilla",
  labelNames: ["method", "model"] as const,
  registers: [metricsRegistry],
});

export const dbOperationsTotal = new Counter({
  name: "zilla_db_operations_total",
  help: "Total number of database operations performed by Zilla",
  labelNames: OPERATION_LABELS,
  registers: [metricsRegistry],
});

export const dbOperationDurationSeconds = new Histogram({
  name: "zilla_db_operation_duration_seconds",
  help: "Duration of database operations performed by Zilla in seconds",
  labelNames: OPERATION_LABELS,
  buckets: [0.001, 0.0025, 0.005, 0.01, 0.025, 0.05, 0.1, 0.25, 0.5, 1, 2.5, 5],
  registers: [metricsRegistry],
});

export const redisOperationsTotal = new Counter({
  name: "zilla_redis_operations_total",
  help: "Total number of Redis operations performed by Zilla",
  labelNames: OPERATION_LABELS,
  registers: [metricsRegistry],
});

export const redisOperationDurationSeconds = new Histogram({
  name: "zilla_redis_operation_duration_seconds",
  help: "Duration of Redis operations performed by Zilla in seconds",
  labelNames: OPERATION_LABELS,
  buckets: [0.0005, 0.001, 0.0025, 0.005, 0.01, 0.025, 0.05, 0.1, 0.25, 0.5, 1],
  registers: [metricsRegistry],
});

type PoolRegistration = {sequelize: Sequelize; tenant: string};
const sequelizePools = new Map<string, PoolRegistration>();

new Gauge({
  name: "zilla_db_pool_connections",
  help: "Current Sequelize connection pool state",
  labelNames: ["state", "model", "tenant"] as const,
  registers: [metricsRegistry],
  collect() {
    this.reset();
    for (const {sequelize, tenant} of sequelizePools.values()) {
      const pool = (sequelize as any).connectionManager?.pool;
      if (!pool) continue;
      const labels = {model: configuredModel(), tenant};
      this.set({...labels, state: "size"}, Number(pool.size ?? 0));
      this.set({...labels, state: "available"}, Number(pool.available ?? 0));
      this.set({...labels, state: "using"}, Number(pool.using ?? 0));
      this.set({...labels, state: "waiting"}, Number(pool.waiting ?? 0));
    }
  },
});

function normalizedRoute(req: any): string {
  if (!req.route?.path) return "unmatched";
  const baseUrlSegments = String(req.baseUrl || "")
    .split("/")
    .filter(Boolean);
  const pathSegments = String(req.path || "")
    .split("/")
    .filter(Boolean);
  const originalUrlSegments = String(req.originalUrl || "")
    .split("?", 1)[0]
    .split("/")
    .filter(Boolean);
  const prefix =
    baseUrlSegments.find((segment) => ALLOWED_ROUTE_PREFIXES.has(segment)) ||
    originalUrlSegments.find((segment) => ALLOWED_ROUTE_PREFIXES.has(segment)) ||
    pathSegments[0];
  if (!prefix || !ALLOWED_ROUTE_PREFIXES.has(prefix)) return "unmatched";
  const routePath = Array.isArray(req.route.path) ? req.route.path[0] : String(req.route.path);
  if (routePath.startsWith("/api/")) return routePath;
  return `/api/${prefix}${routePath === "/" ? "" : routePath}`;
}

export function createHttpMetricsMiddleware(resolveTenant: (req: any) => string): RequestHandler {
  return (req, res, next) => {
    const method = req.method.toUpperCase();
    const model = configuredModel();
    const startedAt = process.hrtime.bigint();
    httpRequestsInFlight.inc({method, model});

    let route = "unmatched";
    let tenant = "unknown";
    const originalEnd = res.end;
    (res as any).end = function (...args: any[]) {
      route = normalizedRoute(req);
      tenant = normalizeTenant(resolveTenant(req));
      return originalEnd.apply(this, args as any);
    };

    let completed = false;
    const complete = () => {
      if (completed) return;
      completed = true;
      httpRequestsInFlight.dec({method, model});

      const labels = {
        method,
        route,
        status_code: String(res.statusCode),
        model,
        tenant,
      };
      const durationSeconds = Number(process.hrtime.bigint() - startedAt) / 1_000_000_000;
      httpRequestsTotal.inc(labels);
      httpRequestDurationSeconds.observe(labels, durationSeconds);
    };

    res.once("finish", complete);
    res.once("close", complete);
    next();
  };
}

function operationFromQuery(args: any[]): string {
  const type = args[1]?.type;
  if (typeof type === "string" && /^[A-Z_]+$/.test(type)) return type.toLowerCase();
  const sql = typeof args[0] === "string" ? args[0].trim().split(/\s+/, 1)[0]?.toLowerCase() : "";
  return ["select", "insert", "update", "delete", "begin", "commit", "rollback"].includes(sql) ? sql : "other";
}

export function instrumentSequelize(sequelize: Sequelize, tenant: string): void {
  const safeTenant = normalizeTenant(tenant);
  const key = `${safeTenant}:${sequelizePools.size}`;
  sequelizePools.set(key, {sequelize, tenant: safeTenant});

  const originalQuery = (sequelize as any).query.bind(sequelize);
  (sequelize as any).query = async (...args: any[]) => {
    const operation = operationFromQuery(args);
    const startedAt = process.hrtime.bigint();
    try {
      const result = await originalQuery(...args);
      observeOperation(dbOperationsTotal, dbOperationDurationSeconds, operation, safeTenant, startedAt, "success");
      return result;
    } catch (error) {
      observeOperation(dbOperationsTotal, dbOperationDurationSeconds, operation, safeTenant, startedAt, "error");
      throw error;
    }
  };
}

function observeOperation(
  counter: Counter<(typeof OPERATION_LABELS)[number]>,
  histogram: Histogram<(typeof OPERATION_LABELS)[number]>,
  operation: string,
  tenant: string,
  startedAt: bigint,
  status: "success" | "error"
): void {
  const labels = {operation, status, model: configuredModel(), tenant: normalizeTenant(tenant)};
  counter.inc(labels);
  histogram.observe(labels, Number(process.hrtime.bigint() - startedAt) / 1_000_000_000);
}

export async function observeRedisOperation<T>(operation: string, tenant: string, callback: () => Promise<T>): Promise<T> {
  const startedAt = process.hrtime.bigint();
  try {
    const result = await callback();
    observeOperation(redisOperationsTotal, redisOperationDurationSeconds, operation, tenant, startedAt, "success");
    return result;
  } catch (error) {
    observeOperation(redisOperationsTotal, redisOperationDurationSeconds, operation, tenant, startedAt, "error");
    throw error;
  }
}
