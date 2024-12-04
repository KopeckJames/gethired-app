export interface ClientEnv {
  MONGODB_URI: string;
  GOOGLE_CLIENT_ID: string;
  APP_URL: string;
}

declare global {
  interface Window {
    ENV: ClientEnv;
  }
}

export function getPublicEnv(): ClientEnv {
  return {
    MONGODB_URI: process.env.MONGODB_URI!,
    GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID!,
    APP_URL: process.env.APP_URL!,
  };
}

// Server-only environment variables
export const ENV = {
  MONGODB_URI: process.env.MONGODB_URI!,
  GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID!,
  GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET!,
  JWT_SECRET: process.env.JWT_SECRET!,
  APP_URL: process.env.APP_URL!,
};

// Validate required environment variables
const requiredServerEnvVars = [
  'MONGODB_URI',
  'GOOGLE_CLIENT_ID',
  'GOOGLE_CLIENT_SECRET',
  'JWT_SECRET',
  'APP_URL',
] as const;

for (const envVar of requiredServerEnvVars) {
  if (!ENV[envVar]) {
    throw new Error(`${envVar} is required`);
  }
}

// Validate required client environment variables
const requiredClientEnvVars = [
  'MONGODB_URI',
  'GOOGLE_CLIENT_ID',
  'APP_URL',
] as const;

export function validatePublicEnv() {
  const env = getPublicEnv();
  for (const envVar of requiredClientEnvVars) {
    if (!env[envVar]) {
      throw new Error(`${envVar} is required`);
    }
  }
}
