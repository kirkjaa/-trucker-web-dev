import dotenv from "dotenv";
import { z } from "zod";

dotenv.config();

const envSchema = z.object({
  NODE_ENV: z.string().optional(),
  PORT: z.coerce.number().default(5300),
  DATABASE_URL: z.string().optional(),
  POSTGRES_DB: z.string().optional(),
  POSTGRES_USER: z.string().optional(),
  POSTGRES_PASSWORD: z.string().optional(),
  POSTGRES_HOST: z.string().optional(),
  POSTGRES_PORT: z.string().optional(),
  JWT_SECRET: z.string(),
  REFRESH_TOKEN_SECRET: z.string(),
  JWT_ACCESS_TOKEN_EXPIRES_IN: z.coerce.number().default(900),
  JWT_REFRESH_TOKEN_EXPIRES_IN: z.coerce.number().default(60 * 60 * 24 * 7),
});

const env = envSchema.parse(process.env);

function buildDatabaseUrl() {
  if (env.DATABASE_URL) {
    return env.DATABASE_URL;
  }

  const host = env.POSTGRES_HOST || "localhost";
  const port = env.POSTGRES_PORT || "5432";
  const db = env.POSTGRES_DB || "trucker_web";
  const user = env.POSTGRES_USER || "trucker_user";
  const password = env.POSTGRES_PASSWORD || "change_this_password";

  return `postgresql://${encodeURIComponent(user)}:${encodeURIComponent(
    password
  )}@${host}:${port}/${db}`;
}

export const config = {
  nodeEnv: env.NODE_ENV || "development",
  port: env.PORT,
  databaseUrl: buildDatabaseUrl(),
  jwtSecret: env.JWT_SECRET,
  refreshTokenSecret: env.REFRESH_TOKEN_SECRET,
  accessTokenTtl: env.JWT_ACCESS_TOKEN_EXPIRES_IN,
  refreshTokenTtl: env.JWT_REFRESH_TOKEN_EXPIRES_IN,
};

