import {NextFunction, Request, Response} from "express";
import Joi from "joi";
import {TenantService} from "../../config/tenant.config";
import {BadRequest, UnauthorizedAccess} from "../../domain/errors/errors.index";
import {Middleware} from "../../domain/types/Middleware";
import {IRedisClient, RedisClient} from "../../external/redis/redis.client";
import {JoiValidator} from "../../lib/joi/joi.validator";
import {JwtGenerator} from "../../lib/jwt/jwt.generator";

const headersSchema = Joi.object({
  userId: Joi.string().uuid().required(),
  tenant: Joi.string().required(),
});

export class TokenMiddleware {
  public static get middleware(): Middleware {
    return async (req: Request, res: Response, next: NextFunction) => {
      const redisClient: IRedisClient = RedisClient.getInstance();

      const bearerToken = req.headers["authorization"];
      const tenantIdHeader = req.headers["tenant"] as string;

      const token = bearerToken ? bearerToken.replace("Bearer ", "") : null;

      // Routes that don't require authentication but need tenant validation
      const isHealthRoute = req.method === "GET" && req.path === "/health";
      const isLoginRoute = req.method === "POST" && req.path === "/user/login";
      const isForgottenPasswordRoute = req.method === "POST" && req.path === "/user/set-forgotten-password";

      // Health route doesn't need tenant validation
      if (isHealthRoute) {
        return next();
      }

      // All routes except health need tenant header
      if (!tenantIdHeader) {
        return next(new BadRequest("Tenant header is required", {message: "Missing tenant header"}));
      }

      let tenantSchemaName: string;
      let redisDb: number;
      try {
        const tenantConfig = TenantService.getTenantById(tenantIdHeader);
        tenantSchemaName = tenantConfig.schemaName;
        redisDb = tenantConfig.redisDb;
      } catch (error) {
        return next(new BadRequest("Invalid tenant", {message: error instanceof Error ? error.message : "Unknown tenant error"}));
      }

      // Login and set password routes only need tenant validation
      if (isLoginRoute || isForgottenPasswordRoute) {
        req.headers.tenantSchemaName = tenantSchemaName;
        req.headers.tenantId = tenantIdHeader;
        req.headers.redisDb = redisDb.toString();
        return next();
      }

      if (!token) {
        console.warn("Token is required", req.method, req.path);
        return next(new UnauthorizedAccess("Unauthorized Access", {message: "Token is required"}));
      }

      if (req.method === "POST" && req.path === "/user/logout") {
        await redisClient.setBlacklistedToken(redisDb, token);

        return res.status(200).json({
          message: "Logged out successfully",
        });
      }

      try {
        const isBlacklistedToken = await redisClient.isBlacklistedToken(redisDb, token);

        if (isBlacklistedToken) {
          return next(new UnauthorizedAccess("Unauthorized Access", {message: "Token is blacklisted"}));
        }

        // Extract tenant and user from token
        const tokenPayload = JwtGenerator.getTokenPayload(token);
        const {userId, tenantId} = tokenPayload;

        // Validate that tenant from header matches tenant from token
        if (tenantIdHeader !== tenantId) {
          return next(
            new UnauthorizedAccess("Tenant mismatch", {
              message: `Tenant sent in header (${tenantIdHeader}) doesn't match the one in Bearer token.`,
            })
          );
        }

        // Set user and tenant info in headers for downstream use
        req.headers.userId = userId;
        req.headers.tenant = tenantId;
        req.headers.tenantSchemaName = tenantSchemaName;
        req.headers.redisDb = redisDb.toString();

        const result = JoiValidator.checkSchema(req.headers, headersSchema, {allowUnknown: true});

        if (result.errors || !result.value) {
          return next(new UnauthorizedAccess("Unauthorized Access", {message: "Invalid headers"}));
        }

        return next();
      } catch (error) {
        return next(new UnauthorizedAccess("Unauthorized Access", {message: "Token expired or invalid"}));
      }
    };
  }
}
