export interface TenantConfig {
  tenantId: string;
  schemaName: string;
  displayName: string;
  redisDb: number;
  isActive: boolean;
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
  },
  tenant1: {
    tenantId: "tenant1",
    schemaName: "tenant1",
    displayName: "Tenant 1",
    redisDb: 1,
    isActive: true,
  },
  tenant2: {
    tenantId: "tenant2",
    schemaName: "tenant2",
    displayName: "Tenant 2",
    redisDb: 2,
    isActive: true,
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
}
