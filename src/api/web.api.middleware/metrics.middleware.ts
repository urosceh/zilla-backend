import {TenantConfigurations} from "../../config/tenant.config";
import {createHttpMetricsMiddleware} from "../../observability/metrics";

export const metricsMiddleware = createHttpMetricsMiddleware((req) => {
  const tenantId = req.headers.tenantId;
  return typeof tenantId === "string" && TenantConfigurations[tenantId]?.isActive ? tenantId : "unknown";
});
