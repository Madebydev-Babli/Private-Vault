import "server-only";
import { randomUUID } from "node:crypto";
import { getDb } from "./db";
import { decryptText, encryptText, type EncryptedValue } from "./encryption";

export type CapsuleDocument = {
  _id: string;
  title: string;
  encryptedContent: string;
  iv: string;
  authTag: string;
  unlockAt: Date;
  createdAt: Date;
  updatedAt: Date;
};

export type CapsuleInput = { title: string; content?: string; unlockAt: Date };
const collectionName = "capsules";

function cleanText(value: unknown, maxLength: number) {
  return typeof value === "string" ? value.trim().slice(0, maxLength) : "";
}

export function parseCapsuleInput(body: unknown): CapsuleInput | null {
  if (!body || typeof body !== "object") return null;
  const input = body as Record<string, unknown>;
  const title = cleanText(input.title, 140);
  const content = cleanText(input.content, 20_000);
  const unlockAtValue = cleanText(input.unlockAt, 80);
  const unlockAt = new Date(unlockAtValue);

  if (!title || !content || !unlockAtValue || Number.isNaN(unlockAt.getTime())) {
    return null;
  }
  if (unlockAt.getTime() <= Date.now()) return null;
  return { title, content, unlockAt };
}

export function parseCapsuleUpdate(body: unknown) {
  if (!body || typeof body !== "object") return null;
  const input = body as Record<string, unknown>;
  const title = cleanText(input.title, 140);
  const content = cleanText(input.content, 20_000);
  const unlockAtValue = cleanText(input.unlockAt, 80);
  const unlockAt = new Date(unlockAtValue);
  if (!title || !unlockAtValue || Number.isNaN(unlockAt.getTime()) || unlockAt.getTime() <= Date.now()) return null;
  return { title, unlockAt, ...(content ? { content } : {}) };
}

export function isCapsuleUnlocked(capsule: CapsuleDocument, now = new Date()) {
  return now.getTime() >= capsule.unlockAt.getTime();
}

export async function listCapsules() {
  return (await getDb())
    .collection<CapsuleDocument>(collectionName)
    .find({}, { projection: { encryptedContent: 0, iv: 0, authTag: 0 } })
    .sort({ unlockAt: 1, createdAt: -1 })
    .toArray();
}

export async function findCapsule(id: string) {
  return (await getDb()).collection<CapsuleDocument>(collectionName).findOne({ _id: id });
}

export async function createCapsule(input: CapsuleInput) {
  if (!input.content) throw new Error("Capsule content is required.");
  const encrypted = encryptText(input.content);
  const now = new Date();
  const capsule: CapsuleDocument = {
    _id: randomUUID(),
    title: input.title,
    encryptedContent: encrypted.ciphertext,
    iv: encrypted.iv,
    authTag: encrypted.authTag,
    unlockAt: input.unlockAt,
    createdAt: now,
    updatedAt: now,
  };
  await (await getDb()).collection<CapsuleDocument>(collectionName).insertOne(capsule);
  return capsule;
}

export async function updateCapsule(id: string, input: { title: string; unlockAt: Date; content?: string }) {
  const encrypted = input.content ? encryptText(input.content) : null;
  const setFields: Partial<CapsuleDocument> = {
    title: input.title,
    unlockAt: input.unlockAt,
    updatedAt: new Date(),
  };
  if (encrypted) {
    setFields.encryptedContent = encrypted.ciphertext;
    setFields.iv = encrypted.iv;
    setFields.authTag = encrypted.authTag;
  }
  return (await getDb()).collection<CapsuleDocument>(collectionName).findOneAndUpdate(
    { _id: id },
    { $set: setFields },
    { returnDocument: "after" },
  );
}

export async function deleteCapsule(id: string) {
  return (await getDb()).collection<CapsuleDocument>(collectionName).deleteOne({ _id: id });
}

export function decryptCapsuleContent(capsule: CapsuleDocument) {
  const encrypted: EncryptedValue = {
    ciphertext: capsule.encryptedContent,
    iv: capsule.iv,
    authTag: capsule.authTag,
  };
  return decryptText(encrypted);
}

export function serializeCapsule(capsule: CapsuleDocument, now = new Date()) {
  return {
    _id: capsule._id,
    title: capsule.title,
    unlockAt: capsule.unlockAt.toISOString(),
    createdAt: capsule.createdAt.toISOString(),
    updatedAt: capsule.updatedAt.toISOString(),
    locked: !isCapsuleUnlocked(capsule, now),
  };
}
