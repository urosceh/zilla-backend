import {RedisClientType} from "redis";
import {normalizeTenant, observeRedisOperation} from "../../observability/metrics";

type RedisCommandClient = Pick<RedisClientType, "get" | "set" | "del" | "flushDb" | "quit">;

export class InstrumentedRedisClient {
  private readonly tenant: string;

  public constructor(private readonly client: RedisCommandClient, tenant: string) {
    this.tenant = normalizeTenant(tenant);
  }

  public get(key: string): Promise<string | null> {
    return observeRedisOperation("get", this.tenant, () => this.client.get(key));
  }

  public async set(key: string, value: string): Promise<void> {
    await observeRedisOperation("set", this.tenant, () => this.client.set(key, value));
  }

  public async del(key: string): Promise<void> {
    await observeRedisOperation("del", this.tenant, () => this.client.del(key));
  }

  public async flushDb(): Promise<void> {
    await observeRedisOperation("flushdb", this.tenant, () => this.client.flushDb());
  }

  public async quit(): Promise<void> {
    await this.client.quit();
  }
}
