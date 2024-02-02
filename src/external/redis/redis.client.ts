import {createClient, RedisClientType} from "redis";
import {RedisConfig} from "../../config/redis.config";

export interface IRedisClient {
  getForgottenPasswordToken(email: string): Promise<string | null>;
  isBlacklistedToken(token: string): Promise<boolean>;

  setForgottenPasswordToken(email: string, secret: string): Promise<void>;
  setBlacklistedToken(token: string): Promise<void>;

  deleteForgottenPasswordToken(email: string): Promise<void>;
}

export class RedisClient implements IRedisClient {
  private static _instance: RedisClient;
  private _redisClient: RedisClientType;

  private constructor() {
    const redisUrl = `redis://${RedisConfig.host}:${RedisConfig.port}/${RedisConfig.db}`;

    this._redisClient = createClient({
      url: redisUrl,
      password: RedisConfig.password,
    });

    this._redisClient
      .connect()
      .then(() => {
        console.log("Connected to Redis");
      })
      .catch((error) => {
        console.error("Error connecting to Redis", error);
      });
  }

  public static getInstance(): IRedisClient {
    if (!RedisClient._instance) {
      RedisClient._instance = new RedisClient();
    }
    return RedisClient._instance;
  }

  public async getForgottenPasswordToken(email: string): Promise<string | null> {
    return this._redisClient.get(`${RedisConfig.passwordForgottenFlag}${email}`);
  }

  public async isBlacklistedToken(token: string): Promise<boolean> {
    const result = await this._redisClient.get(token);

    return result === "blacklist";
  }

  public async setForgottenPasswordToken(email: string, secret: string): Promise<void> {
    await this._redisClient.set(`${RedisConfig.passwordForgottenFlag}${email}`, secret);
  }

  public async setBlacklistedToken(token: string): Promise<void> {
    await this._redisClient.set(token, "blacklist");
  }

  public async deleteForgottenPasswordToken(email: string): Promise<void> {
    await this._redisClient.del(`${RedisConfig.passwordForgottenFlag}${email}`);
  }

  private async set(key: string, value: string): Promise<void> {
    this._redisClient.set(key, value);
  }

  private async get(key: string): Promise<string | null> {
    return this._redisClient.get(key);
  }

  private async del(key: string): Promise<void> {
    this._redisClient.del(key);
  }
}
