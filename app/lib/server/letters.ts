import "server-only";
import { randomUUID } from "node:crypto";
import { getDb } from "./db";
import { decryptText, encryptText, type EncryptedValue } from "./encryption";

export type LetterDocument = {
  _id: string;
  title: string;
  encryptedContent: string;
  iv: string;
  authTag: string;
  date: string;
  createdAt: Date;
  updatedAt: Date;
};

export type LetterInput = { title: string; content: string; date: string };
const collectionName = "letters";

function cleanText(value: unknown, maxLength: number) {
  return typeof value === "string" ? value.trim().slice(0, maxLength) : "";
}

export function parseLetterInput(body: unknown): LetterInput | null {
  if (!body || typeof body !== "object") return null;
  const input = body as Record<string, unknown>;
  const title = cleanText(input.title, 140);
  const content = cleanText(input.content, 20_000);
  const date = cleanText(input.date, 30);
  if (!title || !content || !/^\d{4}-\d{2}-\d{2}$/.test(date)) return null;
  return { title, content, date };
}

export async function listLetters() {
  return (await getDb())
    .collection<LetterDocument>(collectionName)
    .find({}, { projection: { encryptedContent: 0, iv: 0, authTag: 0 } })
    .sort({ date: -1, createdAt: -1 })
    .toArray();
}

export async function findLetter(id: string) {
  return (await getDb())
    .collection<LetterDocument>(collectionName)
    .findOne({ _id: id });
}

export function decryptLetterContent(letter: LetterDocument) {
  const encrypted: EncryptedValue = {
    ciphertext: letter.encryptedContent,
    iv: letter.iv,
    authTag: letter.authTag,
  };
  return decryptText(encrypted);
}

export async function createLetter(input: LetterInput) {
  const encrypted = encryptText(input.content);
  const now = new Date();
  const letter: LetterDocument = {
    _id: randomUUID(),
    title: input.title,
    date: input.date,
    encryptedContent: encrypted.ciphertext,
    iv: encrypted.iv,
    authTag: encrypted.authTag,
    createdAt: now,
    updatedAt: now,
  };
  await (await getDb())
    .collection<LetterDocument>(collectionName)
    .insertOne(letter);
  return letter;
}

export async function updateLetter(
  id: string,
  input: LetterInput,
  reencrypt: boolean,
) {
  const fields: Partial<LetterDocument> = {
    title: input.title,
    date: input.date,
    updatedAt: new Date(),
  };
  if (reencrypt) {
    const encrypted = encryptText(input.content);
    fields.encryptedContent = encrypted.ciphertext;
    fields.iv = encrypted.iv;
    fields.authTag = encrypted.authTag;
  }
  return (await getDb())
    .collection<LetterDocument>(collectionName)
    .findOneAndUpdate(
      { _id: id },
      { $set: fields },
      { returnDocument: "after" },
    );
}

export async function deleteLetter(id: string) {
  return (await getDb())
    .collection<LetterDocument>(collectionName)
    .deleteOne({ _id: id });
}

export function serializeLetter(letter: LetterDocument) {
  return {
    _id: letter._id,
    title: letter.title,
    date: letter.date,
    createdAt: letter.createdAt.toISOString(),
    updatedAt: letter.updatedAt.toISOString(),
  };
}
