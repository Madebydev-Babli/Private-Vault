import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { isSessionValid } from "@/app/lib/server/auth";
import {
  deleteCloudinaryMedia,
  uploadMemoryMedia,
} from "@/app/lib/server/cloudinary";
import {
  deleteMemory,
  findMemory,
  getMemoryMedia,
  getMemoryMediaArray,
  getStoredCloudinaryMedia,
  parseMemoryFields,
  serializeMemory,
  updateMemory,
} from "@/app/lib/server/memories";

async function isAuthenticated() {
  const cookieStore = await cookies();
  return isSessionValid(cookieStore.get("vault_session")?.value);
}

async function getId(context: { params: Promise<{ id: string }> }) {
  return (await context.params).id;
}

export async function GET(
  _request: Request,
  context: { params: Promise<{ id: string }> },
) {
  if (!(await isAuthenticated())) {
    return NextResponse.json(
      { error: "Authentication required." },
      { status: 401 },
    );
  }
  const memory = await findMemory(await getId(context));
  if (!memory)
    return NextResponse.json({ error: "Memory not found." }, { status: 404 });
  return NextResponse.json({ memory: serializeMemory(memory) });
}

export async function PATCH(
  request: Request,
  context: { params: Promise<{ id: string }> },
) {
  if (!(await isAuthenticated())) {
    return NextResponse.json(
      { error: "Authentication required." },
      { status: 401 },
    );
  }
  const formData = await request.formData().catch(() => null);
  if (!formData)
    return NextResponse.json(
      { error: "Invalid memory form." },
      { status: 400 },
    );
  const input = parseMemoryFields(formData);
  if (!input) {
    return NextResponse.json(
      { error: "Please complete the memory details." },
      { status: 400 },
    );
  }
  const id = await getId(context);
  const existing = await findMemory(id);
  if (!existing)
    return NextResponse.json({ error: "Memory not found." }, { status: 404 });

  const uploadedMedia: Awaited<ReturnType<typeof uploadMemoryMedia>>[] = [];
  try {
    const files = getMemoryMedia(formData);
    for (const file of files) uploadedMedia.push(await uploadMemoryMedia(file));
    let requestedRemovedMedia: {
      publicId: string;
      resourceType: "image" | "video";
    }[];
    try {
      requestedRemovedMedia = JSON.parse(
        String(formData.get("removedMedia") ?? "[]"),
      );
    } catch {
      return NextResponse.json({ error: "Invalid removed media list." }, { status: 400 });
    }
    const existingMedia = getMemoryMediaArray(existing);
    const removedMedia = requestedRemovedMedia.filter((media) =>
      existingMedia.some((existingItem) => existingItem.publicId === media.publicId),
    );
    const removedIds = new Set(removedMedia.map((media) => media.publicId));
    const retainedMedia = existingMedia.filter(
      (media) => !removedIds.has(media.publicId),
    );
    const memory = await updateMemory(id, {
      ...input,
      media: [...retainedMedia, ...uploadedMedia],
    });
    if (!memory) {
      for (const media of uploadedMedia) await deleteCloudinaryMedia(media);
      return NextResponse.json({ error: "Memory not found." }, { status: 404 });
    }
    for (const media of removedMedia) {
      try {
        await deleteCloudinaryMedia(media);
      } catch (error) {
        console.error("Unable to remove memory media.", error);
      }
    }
    return NextResponse.json({ memory: serializeMemory(memory) });
  } catch (error) {
    for (const media of uploadedMedia) {
      try {
        await deleteCloudinaryMedia(media);
      } catch (cleanupError) {
        console.error(
          "Unable to clean up uploaded memory media.",
          cleanupError,
        );
      }
    }
    if (error instanceof Error && error.message.startsWith("Please choose")) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    return NextResponse.json(
      { error: "Unable to update this memory." },
      { status: 500 },
    );
  }
}

export async function DELETE(
  _request: Request,
  context: { params: Promise<{ id: string }> },
) {
  if (!(await isAuthenticated())) {
    return NextResponse.json(
      { error: "Authentication required." },
      { status: 401 },
    );
  }
  const id = await getId(context);
  const existing = await findMemory(id);
  if (!existing)
    return NextResponse.json({ error: "Memory not found." }, { status: 404 });
  const media = getStoredCloudinaryMedia(existing);
  for (const item of media) {
    try {
      const result = await deleteCloudinaryMedia(item);
      if (result.result !== "ok" && result.result !== "not found") {
        return NextResponse.json(
          { error: "Unable to remove memory media." },
          { status: 502 },
        );
      }
    } catch {
      return NextResponse.json(
        { error: "Unable to remove memory media." },
        { status: 502 },
      );
    }
  }
  const result = await deleteMemory(id);
  if (!result.deletedCount)
    return NextResponse.json({ error: "Memory not found." }, { status: 404 });
  return NextResponse.json({ deleted: true });
}
