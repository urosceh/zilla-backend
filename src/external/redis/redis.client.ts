import {createClient} from "redis";
import {RedisConfig} from "../../config/redis.config";

export interface IRedisClient {
  getForgottenPasswordToken(redisDb: number, email: string): Promise<string | null>;
  isBlacklistedToken(redisDb: number, token: string): Promise<boolean>;

  setForgottenPasswordToken(redisDb: number, email: string, secret: string): Promise<void>;
  setBlacklistedToken(redisDb: number, token: string): Promise<void>;

  deleteForgottenPasswordToken(redisDb: number, email: string): Promise<void>;
}

export class RedisClient implements IRedisClient {
  private static _instance: RedisClient;
  private _redisClients: Map<number, any> = new Map();

  private constructor() {
    // Initialize connections will be done lazily when needed
  }

  public static getInstance(): IRedisClient {
    if (!RedisClient._instance) {
      RedisClient._instance = new RedisClient();
    }
    return RedisClient._instance;
  }

  /**
   * Get or create a Redis client for a specific database
   */
  private async getRedisClient(dbNumber: number): Promise<any> {
    if (this._redisClients.has(dbNumber)) {
      return this._redisClients.get(dbNumber)!;
    }

    const redisUrl = `redis://${RedisConfig.host}:${RedisConfig.port}/${dbNumber}`;

    const client = createClient({
      url: redisUrl,
      password: RedisConfig.password,
    });

    try {
      await client.connect();
      console.log(`Connected to Redis DB ${dbNumber}`);
      this._redisClients.set(dbNumber, client);
      return client;
    } catch (error) {
      console.error(`Error connecting to Redis DB ${dbNumber}:`, error);
      throw error;
    }
  }

  public async getForgottenPasswordToken(redisDb: number, email: string): Promise<string | null> {
    const client = await this.getRedisClient(redisDb);
    return client.get(`${RedisConfig.passwordForgottenFlag}${email}`);
  }

  public async isBlacklistedToken(redisDb: number, token: string): Promise<boolean> {
    const client = await this.getRedisClient(redisDb);
    const result = await client.get(token);
    return result === "blacklist";
  }

  public async setForgottenPasswordToken(redisDb: number, email: string, secret: string): Promise<void> {
    const client = await this.getRedisClient(redisDb);
    await client.set(`${RedisConfig.passwordForgottenFlag}${email}`, secret);
  }

  public async setBlacklistedToken(redisDb: number, token: string): Promise<void> {
    const client = await this.getRedisClient(redisDb);
    await client.set(token, "blacklist");
  }

  public async deleteForgottenPasswordToken(redisDb: number, email: string): Promise<void> {
    const client = await this.getRedisClient(redisDb);
    await client.del(`${RedisConfig.passwordForgottenFlag}${email}`);
  }

  /**
   * Delete all data for a specific Redis database
   * Useful for tenant cleanup/removal
   */
  public async flushDatabase(redisDb: number): Promise<void> {
    const client = await this.getRedisClient(redisDb);
    await client.flushDb();
  }

  /**
   * Close a specific Redis database connection
   * Useful for tenant cleanup/removal
   */
  public async closeConnection(redisDb: number): Promise<void> {
    const client = this._redisClients.get(redisDb);
    if (client) {
      await client.quit();
      this._redisClients.delete(redisDb);
      console.log(`Closed Redis connection for DB ${redisDb}`);
    }
  }
}
