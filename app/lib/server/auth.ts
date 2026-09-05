import "server-only";
import argon2 from "argon2";
import { createHmac, randomBytes } from "node:crypto";
import { getDb } from "./db";
import { getEnv } from "./env";

const accessId = "private-access";
export const sessionMaxAge = 60 * 60 * 24 * 30;

function digest(value: string) {
  return createHmac("sha256", getEnv().sessionSecret)
    .update(value)
    .digest("hex");
}

export function normalizeEmail(value: string) {
  return value.trim().toLowerCase();
}

export async function verifyCredentials(email: string, password: string) {
  const normalizedEmail = normalizeEmail(email);
  const record = await (
    await getDb()
  )
    .collection<{
      _id: string;
      email?: string;
      passwordHash?: string;
    }>("privateAccess")
    .findOne({ _id: accessId });

  if (!record?.passwordHash) return false;

  if (!record.email || normalizeEmail(record.email) !== normalizedEmail)
    return false;

  return Boolean(await argon2.verify(record.passwordHash, password));
}

export async function createSession() {
  const rawToken = randomBytes(32).toString("hex");
  await (await getDb()).collection("sessions").insertOne({
    tokenHash: digest(rawToken),
    createdAt: new Date(),
    expiresAt: new Date(Date.now() + sessionMaxAge * 1000),
  });
  return rawToken;
}

export async function isSessionValid(rawToken?: string) {
  if (!rawToken) return false;
  const session = await (await getDb())
    .collection("sessions")
    .findOne({ tokenHash: digest(rawToken), expiresAt: { $gt: new Date() } });
  return Boolean(session);
}

export async function deleteSession(rawToken?: string) {
  if (!rawToken) return false;
  const result = await (await getDb())
    .collection("sessions")
    .deleteOne({ tokenHash: digest(rawToken) });
  return result.deletedCount > 0;
}
