export const DatabaseConfig = {
  host: process.env.DB_HOST || "localhost",
  port: process.env.DB_PORT ? parseInt(process.env.DB_PORT, 10) : 5451,
  database: process.env.DB_NAME || "zilla",
  username: process.env.DB_USERNAME || "user",
  password: process.env.DB_PASSWORD || "pass",
  schema: process.env.DB_SCHEMA || "public",
};
