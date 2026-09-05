import "server-only";

function required(name: string) {
  const value = process.env[name];
  if (!value) throw new Error(`${name} is required`);
  return value;
}

export function getEnv() {
  return {
    mongoUri: required("MONGODB_URI"),
    sessionSecret: required("SESSION_SECRET"),
    nodeEnv: process.env.NODE_ENV ?? "development",
  };
}
