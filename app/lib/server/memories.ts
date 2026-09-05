import "server-only";
import { randomUUID } from "node:crypto";
import { getDb } from "./db";
import type { CloudinaryMedia } from "./cloudinary";

export const memoryMoods = [
  "Tender",
  "Joyful",
  "Quiet",
  "Adventurous",
  "Nostalgic",
] as const;
export type MemoryMood = (typeof memoryMoods)[number];

export type MemoryDocument = {
  _id: string;
  title: string;
  story: string;
  date: string;
  mood: MemoryMood;
  location?: string;
  media?: string | CloudinaryMedia;
  createdAt: Date;
  updatedAt: Date;
};

export type MemoryInput = {
  title: string;
  story: string;
  date: string;
  mood: MemoryMood;
  location?: string;
  media?: CloudinaryMedia;
};

const collectionName = "memories";
export const maxImageSize = 5_000_000;
export const acceptedImageTypes = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
] as const;
function cleanText(value: unknown, maxLength: number) {
  return typeof value === "string" ? value.trim().slice(0, maxLength) : "";
}

export function parseMemoryFields(input: FormData) {
  const title = cleanText(input.get("title"), 140);
  const story = cleanText(input.get("story"), 5000);
  const date = cleanText(input.get("date"), 30);
  const mood = cleanText(input.get("mood"), 30);
  const location = cleanText(input.get("location"), 140);

  if (!title || !story || !/^\d{4}-\d{2}-\d{2}$/.test(date)) return null;
  if (!memoryMoods.includes(mood as MemoryMood)) return null;

  return {
    title,
    story,
    date,
    mood: mood as MemoryMood,
    ...(location ? { location } : {}),
  };
}

export function getMemoryImage(input: FormData) {
  const value = input.get("media");
  if (!(value instanceof File) || value.size === 0) return null;
  if (
    !acceptedImageTypes.includes(
      value.type as (typeof acceptedImageTypes)[number],
    )
  ) {
    throw new Error("Please choose a JPEG, PNG, WebP, or GIF image.");
  }
  if (value.size > maxImageSize)
    throw new Error("Please choose an image smaller than 5 MB.");
  return value;
}

export async function listMemories() {
  return (await getDb())
    .collection<MemoryDocument>(collectionName)
    .find({})
    .sort({ date: -1, createdAt: -1 })
    .toArray();
}

export async function findMemory(id: string) {
  return (await getDb())
    .collection<MemoryDocument>(collectionName)
    .findOne({ _id: id });
}

export async function createMemory(input: MemoryInput) {
  const now = new Date();
  const memory: MemoryDocument = {
    _id: randomUUID(),
    ...input,
    createdAt: now,
    updatedAt: now,
  };
  await (await getDb())
    .collection<MemoryDocument>(collectionName)
    .insertOne(memory);
  return memory;
}

export async function updateMemory(id: string, input: MemoryInput) {
  const updatedAt = new Date();
  const result = await (await getDb())
    .collection<MemoryDocument>(collectionName)
    .findOneAndUpdate(
      { _id: id },
      { $set: { ...input, updatedAt } },
      { returnDocument: "after" },
    );
  return result;
}

export function getStoredCloudinaryMedia(memory: MemoryDocument) {
  return memory.media &&
    typeof memory.media !== "string" &&
    memory.media.publicId
    ? memory.media
    : null;
}

export async function deleteMemory(id: string) {
  return (await getDb())
    .collection<MemoryDocument>(collectionName)
    .deleteOne({ _id: id });
}

export function serializeMemory(memory: MemoryDocument) {
  return {
    ...memory,
    createdAt: memory.createdAt.toISOString(),
    updatedAt: memory.updatedAt.toISOString(),
  };
}

export type SerializedMemory = ReturnType<typeof serializeMemory>;
