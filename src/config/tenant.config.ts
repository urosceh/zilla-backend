export interface TenantConfig {
  tenantId: string;
  schemaName: string;
  displayName: string;
  redisDb: number;
  isActive: boolean;
  dbUsername: string;
  dbPassword: string;
}

// This configuration maps tenant IDs to schema names
// In production, this could be loaded from a database or external config service
export const TenantConfigurations: Record<string, TenantConfig> = {
  test: {
    tenantId: "test",
    schemaName: "test",
    displayName: "Test",
    redisDb: 0,
    isActive: true,
    dbUsername: process.env.DB_USER_TEST || "",
    dbPassword: process.env.DB_PASS_TEST || "",
  },
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
