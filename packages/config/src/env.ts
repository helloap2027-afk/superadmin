export interface EnvironmentVariables {
  NODE_ENV: "development" | "staging" | "production" | "test";
  PORT?: number;
  DATABASE_URL: string;
  REDIS_URL?: string;
  JWT_SECRET: string;
  JWT_REFRESH_SECRET: string;
  CORS_ORIGIN?: string;
  STORAGE_BUCKET?: string;
  STORAGE_ENDPOINT?: string;
  STORAGE_ACCESS_KEY?: string;
  STORAGE_SECRET_KEY?: string;
}

export function validateCoreEnv(env: Record<string, string | undefined>): boolean {
  // Validates critical variables exist in non-test mode
  if (env.NODE_ENV === "test") return true;
  return Boolean(env.DATABASE_URL && env.JWT_SECRET);
}

