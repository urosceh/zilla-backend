# Multi-Tenant Backend Configuration

This backend has been configured for multi-tenancy using PostgreSQL schemas and transaction-scoped search paths.

## Architecture Overview

The multi-tenant architecture works as follows:

1. **Tenant Identification**: Each request must include a `tenant` header
2. **Token Validation**: JWT tokens contain both `userId` and `tenantId`
3. **Schema Isolation**: Each tenant has its own PostgreSQL schema
4. **Transaction-Scoped Queries**: Database operations use `SET LOCAL search_path` within transactions

## Configuration

### Tenant Configuration

Tenants are configured in `/src/config/tenant.config.ts`:

```typescript
export const TenantConfigurations: Record<string, TenantConfig> = {
  tenant1: {
    tenantId: "tenant1",
    schemaName: "tenant1_schema",
    displayName: "Tenant 1",
    isActive: true,
  },
  // Add more tenants here
};
```

### Environment Variables

Standard database configuration applies:

- `DB_HOST`: Database host
- `DB_PORT`: Database port
- `DB_NAME`: Database name
- `DB_USERNAME`: Database username
- `DB_PASSWORD`: Database password

## API Usage

### Headers Required

All API requests (except health checks) must include:

- `Authorization: Bearer <token>` (for authenticated routes)
- `tenant: <tenant-id>` (for all routes except health)

### Login Flow

```bash
# Login request
curl -X POST http://localhost:3000/api/user/login \
  -H "Content-Type: application/json" \
  -H "tenant: tenant1" \
  -d '{"email": "user@example.com", "password": "password"}'

# Response includes token with tenantId embedded
{
  "bearerToken": "Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...",
  "adminBearerToken": "Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9..."
}
```

### Authenticated Requests

```bash
# Authenticated request
curl -X GET http://localhost:3000/api/user \
  -H "Authorization: Bearer <token>" \
  -H "tenant: tenant1"
```

The system validates that:

1. The `tenant` header matches the `tenantId` in the JWT token
2. The tenant exists and is active
3. All database operations occur within the tenant's schema

## Database Migrations

### Running Migrations

```bash
# Migrate all active tenants
npm run migrate:all

# Migrate specific tenant
npm run migrate:tenant tenant1_schema

# Check migration status
npm run migrate:status

# Initialize new tenant (creates schema + runs migrations)
npm run migrate:init new_tenant_schema
```

### Manual Migration Commands

```bash
# Create schema and run migrations for new tenant
npx ts-node scripts/migrate-tenants.ts --action=init --tenant=new_tenant_schema

# Update all tenant schemas
npx ts-node scripts/migrate-tenants.ts --action=update --tenant=all

# Check status for specific tenant
npx ts-node scripts/migrate-tenants.ts --action=status --tenant=tenant1_schema

# Rollback migrations (CAUTION)
npx ts-node scripts/migrate-tenants.ts --action=rollback --tenant=tenant1_schema --count=1
```

## Development Workflow

### Adding New Tenants

1. Update `/src/config/tenant.config.ts` with new tenant configuration
2. Run migrations: `npm run migrate:init <new_schema_name>`
3. Restart the application to initialize models

### Service Layer Changes

All services now require the full `Request` object as the first parameter:

```typescript
// Before
await userService.loginUser(credentials);

// After
await userService.loginUser(req, credentials);
```

### Repository Layer Changes

All repositories now accept optional `Transaction` parameters:

```typescript
// Repositories automatically receive transactions from services
await userRepository.getUserByEmail(email, transaction);
```

## Transaction Management

The `TransactionManager` handles schema-scoped transactions:

```typescript
// Automatic transaction management in services
return await TransactionManager.executeInTenantTransaction(req.tenant.schemaName, async (transaction) => {
  return await this._userRepository.loginUser(credentials, transaction);
});
```

## Security Features

1. **Double Validation**: Tenant header must match JWT token tenant
2. **Schema Isolation**: Complete data separation between tenants
3. **Transaction Scope**: Schema switching is transaction-local
4. **Active Tenant Check**: Inactive tenants are rejected

## Error Handling

The system throws specific errors for tenant-related issues:

- Missing tenant header: `BadRequest`
- Invalid tenant: `BadRequest`
- Tenant mismatch: `UnauthorizedAccess`
- Inactive tenant: `BadRequest`

## Monitoring

The application logs tenant information for each request:

- Tenant schema used
- Active database connections
- Migration status
- Transaction scope information
