import {JwtPayload, sign, verify} from "jsonwebtoken";
import {JwtConfig} from "../../config/jwt.config";
import {UnprocessableContent} from "../../domain/errors/errors.index";

export class JwtGenerator {
  public static generateUserBearerToken(userId: string): string {
    const expiresIn = JwtConfig.expiresIn;
    const secret = JwtConfig.secret;

    const token = sign(
      {
        data: userId,
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
    const result: JwtPayload = verify(token, JwtConfig.secret) as JwtPayload;

    if (!result || !result.data) {
      throw new UnprocessableContent("Unprocessable Content", {message: "Invalid JWT userId token"});
    }

    return result.data as string;
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
