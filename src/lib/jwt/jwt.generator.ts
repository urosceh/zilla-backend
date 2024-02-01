import {JwtPayload, sign, verify} from "jsonwebtoken";
import {JwtConfig} from "../../config/jwt.config";

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
    const result: JwtPayload = verify(token.replace("Bearer ", ""), JwtConfig.secret) as JwtPayload;

    if (!result || !result.data) {
      throw new Error("Invalid token");
    }

    return result.data as string;
  }
}
