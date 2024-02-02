import {createClient, RedisClientType} from "redis";
import {RedisConfig} from "../../config/redis.config";

export interface IRedisClient {
  set(key: string, value: string): Promise<void>;
  get(key: string): Promise<string | null>;
  del(key: string): Promise<void>;
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

  public async set(key: string, value: string): Promise<void> {
    this._redisClient.set(key, value);
  }

  public async get(key: string): Promise<string | null> {
    return this._redisClient.get(key);
  }

  public async del(key: string): Promise<void> {
    this._redisClient.del(key);
  }
}
