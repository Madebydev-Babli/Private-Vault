import "server-only";
import { createCipheriv, createDecipheriv, randomBytes } from "node:crypto";

const algorithm = "aes-256-gcm";
const keyLength = 32;

function getEncryptionKey() {
  const configuredKey = process.env.MEMORY_ENCRYPTION_KEY;
  if (!configuredKey) throw new Error("MEMORY_ENCRYPTION_KEY is required.");

  const key = /^[0-9a-f]{64}$/i.test(configuredKey)
    ? Buffer.from(configuredKey, "hex")
    : Buffer.from(configuredKey, "base64");
  if (key.length !== keyLength) {
    throw new Error("MEMORY_ENCRYPTION_KEY must decode to 32 bytes.");
  }
  return key;
}

export type EncryptedValue = {
  ciphertext: string;
  iv: string;
  authTag: string;
};

export function encryptText(value: string): EncryptedValue {
  const iv = randomBytes(12);
  const cipher = createCipheriv(algorithm, getEncryptionKey(), iv);
  const ciphertext = Buffer.concat([
    cipher.update(value, "utf8"),
    cipher.final(),
  ]);
  return {
    ciphertext: ciphertext.toString("base64"),
    iv: iv.toString("base64"),
    authTag: cipher.getAuthTag().toString("base64"),
  };
}

export function decryptText(value: EncryptedValue) {
  const decipher = createDecipheriv(
    algorithm,
    getEncryptionKey(),
    Buffer.from(value.iv, "base64"),
  );
  decipher.setAuthTag(Buffer.from(value.authTag, "base64"));
  return Buffer.concat([
    decipher.update(Buffer.from(value.ciphertext, "base64")),
    decipher.final(),
  ]).toString("utf8");
}
