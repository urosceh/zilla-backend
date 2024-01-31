import {decode, JwtPayload, sign} from "jsonwebtoken";
import {JwtConfig} from "../../config/jwt.config";

export class JwtGenerator {
  public static generateUserBearerToken(userId: string): string {
    const token = sign(
      {
        data: userId,
        exp: JwtConfig.expiresIn,
      },
      JwtConfig.secret
    );

    return "Bearer " + token;
  }

  public static getUserIdFromToken(token: string): string {
    const result: JwtPayload = decode(token.replace("Bearer ", "")) as JwtPayload;

    if (!result || !result.data) {
      throw new Error("Invalid token");
    }

    return result.data as string;
  }
}
