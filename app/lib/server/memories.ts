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

export const memoryPerspectives = ["ritika", "riya"] as const;
export type MemoryPerspective = (typeof memoryPerspectives)[number];

export function normalizeMemoryPerspective(value: unknown): MemoryPerspective {
  return value === "ritika" || value === "riya" ? value : "ritika";
}

export type MemoryDocument = {
  _id: string;
  title: string;
  story: string;
  date: string;
  mood: MemoryMood;
  location?: string;
  perspective?: MemoryPerspective;
  media?: string | CloudinaryMedia | CloudinaryMedia[];
  createdAt: Date;
  updatedAt: Date;
};

export type MemoryInput = {
  title: string;
  story: string;
  date: string;
  mood: MemoryMood;
  location?: string;
  perspective?: MemoryPerspective;
  media?: CloudinaryMedia[];
};

const collectionName = "memories";
export const maxMediaSize = 50_000_000;
export const acceptedMediaTypes = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "video/mp4",
  "video/webm",
  "video/quicktime",
] as const;
function cleanText(value: unknown, maxLength: number) {
  return typeof value === "string" ? value.trim().slice(0, maxLength) : "";
}

export function parseMemoryFields(input: FormData) {
  const title = cleanText(input.get("title"), 140);
  const story = cleanText(input.get("story"), 5000);
  const date = cleanText(input.get("date"), 30);
  const perspective = normalizeMemoryPerspective(input.get("perspective"));

  if (!title || !story || !/^\d{4}-\d{2}-\d{2}$/.test(date)) return null;

  return {
    title,
    story,
    date,
    mood: "Tender" as MemoryMood,
    perspective,
  };
}

export function getMemoryMedia(input: FormData) {
  const files = input
    .getAll("media")
    .filter((value): value is File => value instanceof File && value.size > 0);
  for (const file of files) {
    if (
      !acceptedMediaTypes.includes(
        file.type as (typeof acceptedMediaTypes)[number],
      )
    ) {
      throw new Error("Please choose JPG, PNG, WebP, MP4, WebM, or MOV files.");
    }
    if (file.size > maxMediaSize) {
      throw new Error("Each photo or video must be smaller than 50 MB.");
    }
  }
  return files;
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
    perspective: normalizeMemoryPerspective(input.perspective),
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
      {
        $set: {
          ...input,
          perspective: normalizeMemoryPerspective(input.perspective),
          updatedAt,
        },
      },
      { returnDocument: "after" },
    );
  return result;
}

export function getStoredCloudinaryMedia(memory: MemoryDocument) {
  if (!memory.media || typeof memory.media === "string") return [];
  return Array.isArray(memory.media)
    ? memory.media.filter((media) => media.publicId)
    : memory.media.publicId
      ? [memory.media]
      : [];
}

export function getMemoryMediaArray(memory: MemoryDocument) {
  if (!memory.media || typeof memory.media === "string") return [];
  return Array.isArray(memory.media) ? memory.media : [memory.media];
}

export async function deleteMemory(id: string) {
  return (await getDb())
    .collection<MemoryDocument>(collectionName)
    .deleteOne({ _id: id });
}

export function serializeMemory(memory: MemoryDocument) {
  return {
    ...memory,
    media: getMemoryMediaArray(memory),
    perspective: normalizeMemoryPerspective(memory.perspective),
    createdAt: memory.createdAt.toISOString(),
    updatedAt: memory.updatedAt.toISOString(),
  };
}

export type SerializedMemory = ReturnType<typeof serializeMemory>;
