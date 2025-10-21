import * as fs from "fs";

export interface TenantConfig {
  tenantId: string;
  schemaName: string;
  displayName: string;
  redisDb: number;
  isActive: boolean;
  dbUsername: string;
  dbPassword: string;
}

interface TenantConfigData {
  tenantId: string;
  schemaName: string;
  displayName: string;
  redisDb: number;
  isActive: boolean;
}

// Load tenant configurations from ConfigMap or fallback to environment
function loadTenantConfigurations(): Record<string, TenantConfig> {
  try {
    // Try to load from ConfigMap mounted volume
    const configPath = process.env.TENANT_CONFIG_PATH || "/etc/config/tenants.json";
    if (fs.existsSync(configPath)) {
      const configData = JSON.parse(fs.readFileSync(configPath, "utf8"));
      const configurations: Record<string, TenantConfig> = {};

      for (const [tenantId, config] of Object.entries(configData)) {
        const tenantConfig = config as TenantConfigData;
        configurations[tenantId] = {
          ...tenantConfig,
          dbUsername: process.env[`DB_USER_${tenantId.toUpperCase()}`] || "",
          dbPassword: process.env[`DB_PASS_${tenantId.toUpperCase()}`] || "",
        };
      }

      return {
        test: {
          tenantId: "test",
          schemaName: "test",
          displayName: "Test",
          redisDb: 0,
          isActive: true,
          dbUsername: process.env.DB_USER_TEST || "",
          dbPassword: process.env.DB_PASS_TEST || "",
        },
        ...configurations,
      };
    }
  } catch (error) {
    console.warn("Failed to load tenant config from ConfigMap, falling back to environment variables:", error);
  }

  // Fallback to hardcoded configuration
  return {
    meta: {
      tenantId: "meta",
      schemaName: "meta",
      displayName: "Meta",
      redisDb: 1,
      isActive: true,
      dbUsername: process.env.DB_USER_META || "",
      dbPassword: process.env.DB_PASS_META || "",
    },
    amazon: {
      tenantId: "amazon",
      schemaName: "amazon",
      displayName: "Amazon",
      redisDb: 2,
      isActive: true,
      dbUsername: process.env.DB_USER_AMAZON || "",
      dbPassword: process.env.DB_PASS_AMAZON || "",
    },
    tesla: {
      tenantId: "tesla",
      schemaName: "tesla",
      displayName: "Tesla",
      redisDb: 3,
      isActive: true,
      dbUsername: process.env.DB_USER_TESLA || "",
      dbPassword: process.env.DB_PASS_TESLA || "",
    },
  };
}

export const TenantConfigurations: Record<string, TenantConfig> = loadTenantConfigurations();

export class TenantService {
  public static getTenantById(tenantId: string): TenantConfig {
    const tenant = TenantConfigurations[tenantId];

    if (!tenant) {
      throw new Error(`No tenant configuration found for tenant ID: ${tenantId}`);
    }

    if (!tenant.isActive) {
      throw new Error(`Tenant ${tenantId} is not active`);
    }

    return tenant;
  }

  public static getTenantDatabaseCredentials(tenantId: string): {username: string; password: string; schema: string} {
    const tenant = this.getTenantById(tenantId);

    return {
      username: tenant.dbUsername,
      password: tenant.dbPassword,
      schema: tenant.schemaName,
    };
  }
}
