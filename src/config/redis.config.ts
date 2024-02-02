export const RedisConfig = {
  host: process.env.REDIS_HOST || "localhost",
  port: process.env.REDIS_PORT || 6379,
  password: process.env.REDIS_PASSWORD || "password",
  db: process.env.REDIS_DB || 0,
};
