export interface ClientEnv {
  MONGODB_URI: string;
  GOOGLE_CLIENT_ID: string;
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
  };
}

// Server-only environment variables
export const ENV = {
  MONGODB_URI: process.env.MONGODB_URI!,
  GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID!,
  GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET!,
  JWT_SECRET: process.env.JWT_SECRET!,
};

// Validate required environment variables
const requiredServerEnvVars = [
  'MONGODB_URI',
  'GOOGLE_CLIENT_ID',
  'GOOGLE_CLIENT_SECRET',
  'JWT_SECRET',
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
] as const;

export function validatePublicEnv() {
  const env = getPublicEnv();
  for (const envVar of requiredClientEnvVars) {
    if (!env[envVar]) {
      throw new Error(`${envVar} is required`);
    }
  }
}
