import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { isSessionValid } from "@/app/lib/server/auth";
import {
  deleteCloudinaryMedia,
  uploadMemoryImage,
} from "@/app/lib/server/cloudinary";
import {
  deleteMemory,
  findMemory,
  getMemoryImage,
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

  let uploadedMedia: Awaited<ReturnType<typeof uploadMemoryImage>> | undefined;
  try {
    const image = getMemoryImage(formData);
    uploadedMedia = image ? await uploadMemoryImage(image) : undefined;
    const memory = await updateMemory(id, {
      ...input,
      ...(uploadedMedia ? { media: uploadedMedia } : {}),
    });
    if (!memory) {
      if (uploadedMedia) await deleteCloudinaryMedia(uploadedMedia);
      return NextResponse.json({ error: "Memory not found." }, { status: 404 });
    }
    const oldMedia = getStoredCloudinaryMedia(existing);
    if (uploadedMedia && oldMedia) {
      try {
        await deleteCloudinaryMedia(oldMedia);
      } catch (error) {
        console.error("Unable to remove the previous memory image.", error);
      }
    }
    return NextResponse.json({ memory: serializeMemory(memory) });
  } catch (error) {
    if (uploadedMedia) {
      try {
        await deleteCloudinaryMedia(uploadedMedia);
      } catch (cleanupError) {
        console.error(
          "Unable to clean up the replacement memory image.",
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
  if (media) {
    try {
      const result = await deleteCloudinaryMedia(media);
      if (result.result !== "ok" && result.result !== "not found") {
        return NextResponse.json(
          { error: "Unable to remove the memory image." },
          { status: 502 },
        );
      }
    } catch {
      return NextResponse.json(
        { error: "Unable to remove the memory image." },
        { status: 502 },
      );
    }
  }
  const result = await deleteMemory(id);
  if (!result.deletedCount)
    return NextResponse.json({ error: "Memory not found." }, { status: 404 });
  return NextResponse.json({ deleted: true });
}
