import {JwtPayload, sign, verify} from "jsonwebtoken";
import {JwtConfig} from "../../config/jwt.config";
import {UnprocessableContent} from "../../domain/errors/errors.index";

export interface TokenPayload {
  userId: string;
  tenantId: string;
}

export class JwtGenerator {
  public static generateUserBearerToken(userId: string, tenantId: string): string {
    const expiresIn = JwtConfig.expiresIn;
    const secret = JwtConfig.secret;

    const token = sign(
      {
        data: {
          userId,
          tenantId,
        },
      },
      secret,
      {
        expiresIn,
      }
    );

    console.log(new Date());

    return "Bearer " + token;
  }

  public static getUserIdFromToken(token: string): string {
    const payload = this.getTokenPayload(token);
    return payload.userId;
  }

  public static getTenantIdFromToken(token: string): string {
    const payload = this.getTokenPayload(token);
    return payload.tenantId;
  }

  public static getTokenPayload(token: string): TokenPayload {
    const result: JwtPayload = verify(token, JwtConfig.secret) as JwtPayload;

    if (!result || !result.data) {
      throw new UnprocessableContent("Unprocessable Content", {message: "Invalid JWT token"});
    }

    // Handle backward compatibility with old tokens that only had userId
    if (typeof result.data === "string") {
      throw new UnprocessableContent("Unprocessable Content", {message: "Token format is outdated, please login again"});
    }

    const {userId, tenantId} = result.data;

    if (!userId || !tenantId) {
      throw new UnprocessableContent("Unprocessable Content", {message: "Invalid JWT token payload"});
    }

    return {userId, tenantId};
  }

  public static generateForgottenPasswordToken(email: string, token: string): string {
    const expiresIn = JwtConfig.forgottenPasswordExpiresIn;
    const secret = JwtConfig.secret;

    const tokenString = sign(
      {
        data: `${email}@@@${token}`,
      },
      secret,
      {
        expiresIn,
      }
    );

    return tokenString;
  }

  public static decodeForgottenPasswordToken(securityCode: string): {email: string; token: string} {
    const result: JwtPayload = verify(securityCode, JwtConfig.secret) as JwtPayload;

    if (!result || !result.data) {
      throw new UnprocessableContent("Unprocessable Content", {message: "Invalid JWT forgotten password token"});
    }

    const [email, token] = (result.data as string).split("@@@");

    return {
      email,
      token,
    };
  }
}
